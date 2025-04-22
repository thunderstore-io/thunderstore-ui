import { UserMedia } from "../client/types";
import { UsermediaEndpoints } from "../client/endpoints";
import { ApiConfig } from "../client/config";
import { TypedEventEmitter } from "@thunderstore/typed-event-emitter";
import { BaseUpload } from "./BaseUpload";
import { UploadConfig, UploadProgress } from "./types";
import {
  getMD5WorkerManager,
  MD5WorkerManager,
  MD5WorkerManagerError,
} from "../workers";
import {
  postUsermediaFinish,
  postUsermediaInitiate,
} from "@thunderstore/thunderstore-api";

export type MultiPartUploadOptions = {
  api: ApiConfig;
  file: File;
  maxConcurrentParts?: number;
  bandwidthLimit?: number;
};

/**
 * A multi-part upload consists of 3 stages:
 *
 * 1. Creating an upload handle on the server. Server returns back an ID and
 *    configuration for how the upload should be chunked.
 * 2. Uploading all chunks to URLs provided by the server in step 1 and storing
 *    the resulting IDs (response ETag header)
 * 3. Finalizing the upload by submitting all chunk IDs obtained from step 2
 *    to the server along with the upload handle ID.
 */

type UploadPart = {
  payload: Blob;
  meta: {
    part_number: number;
    url: string;
  };
  etag?: string;
};

export interface IUploadHandle {
  get progress(): UploadProgress;
  onProgress: TypedEventEmitter<UploadProgress>;
}

export class MultipartUpload extends BaseUpload {
  private file: File;
  private api: ApiConfig;
  private parts: UploadPart[] = [];
  private partStates: {
    [key: string]: {
      part: UploadPart;
      uniqueId: string;
      state:
        | "pending"
        | "prepared"
        | "uploading"
        | "complete"
        | "error"
        | "paused";
      etag: string | undefined;
      error: string | undefined;
      checksum: string | undefined;
    };
  } = {};
  private onGoingUploads: Promise<void>[] = [];
  // private completedParts: { ETag: string; PartNumber: number }[] = [];
  private handle?: UserMedia;
  private md5WorkerManager: MD5WorkerManager;

  constructor(options: MultiPartUploadOptions, config?: UploadConfig) {
    super(config);
    this.file = options.file;
    this.api = options.api;
    this.metrics.totalBytes = this.file.size;
    this.md5WorkerManager = getMD5WorkerManager();
  }

  get uploadHandle(): UserMedia | undefined {
    return this.handle;
  }

  private slicePart(offset: number, length: number): Blob {
    const start = offset;
    const end = offset + length;
    return end < this.file.size
      ? this.file.slice(start, end)
      : this.file.slice(start);
  }

  async start(): Promise<void> {
    if (this.status === "running") {
      throw new Error("Upload already running");
    }

    try {
      this.setStatus("running");
      this.metrics.startTime = Date.now();
      this.metrics.lastUpdateTime = this.metrics.startTime;

      // Initialize upload
      const initiateResult = await postUsermediaInitiate({
        config: () => this.requestConfig,
        params: {},
        data: {
          filename: this.file.name,
          file_size_bytes: this.file.size,
        },
        queryParams: {},
      });

      this.handle = initiateResult.user_media;

      // Create parts
      this.parts = initiateResult.upload_urls.map((x) => ({
        payload: this.slicePart(x.offset, x.length),
        meta: {
          part_number: x.part_number,
          url: x.url,
        },
      }));

      // Prepare parts
      for (let i = 0; i < this.parts.length; i) {
        const uniqueId = `${this.handle.uuid}-${this.parts[i].meta.part_number}`;
        this.partStates[uniqueId] = {
          part: this.parts[i],
          uniqueId,
          state: "prepared",
          etag: undefined,
          error: undefined,
          checksum: undefined,
        };
      }

      // Upload parts concurrently
      const maxConcurrent = this.config.maxConcurrentParts ?? 3;
      for (let i = 0; i < this.parts.length; i += maxConcurrent) {
        const batch = this.parts.slice(i, i + maxConcurrent);

        batch.map((part) => {
          if (!this.handle) {
            throw new Error("Upload handle not found");
          }
          this.onGoingUploads.push(
            this.uploadPart(
              `${this.handle.uuid}-${part.meta.part_number}`,
              part,
              this.md5WorkerManager
            )
          );
        });
        await Promise.all(this.onGoingUploads);
      }

      if (
        Object.values(this.partStates).some((part) => part.state === "error")
      ) {
        throw new Error("Parts of the upload failed, please retry.");
      }

      const completeParts: { ETag: string; PartNumber: number }[] = [];

      Object.values(this.partStates).map((ps) => {
        if (!ps.etag) {
          throw new Error("Parts of the upload were not uploaded correctly.");
        }
        completeParts.push({
          ETag: ps.etag,
          PartNumber: ps.part.meta.part_number,
        });
      });

      // Complete upload
      const finishResult = await postUsermediaFinish({
        config: () => this.requestConfig,
        params: {
          uuid: this.handle.uuid,
        },
        data: {
          parts: completeParts,
        },
        queryParams: {},
      });

      this.handle = finishResult;

      this.setStatus("complete");
    } catch (error) {
      if (error instanceof Error) {
        this.setError({
          code: "UPLOAD_FAILED",
          message: error.message,
          retryable: true,
          details: error,
        });
      }
      this.setStatus("failed");
    }
  }

  async uploadPart(
    uniqueId: string,
    part: UploadPart,
    md5WorkerManager: MD5WorkerManager
  ) {
    const checksum = await md5WorkerManager.calculateMD5(
      uniqueId,
      part.payload
    );

    if (checksum instanceof MD5WorkerManagerError) {
      throw checksum;
    }

    this.partStates[uniqueId] = {
      part,
      uniqueId,
      state: "pending",
      etag: undefined,
      error: undefined,
      checksum,
    };

    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Set up progress tracking
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          this.updateProgress(uniqueId, {
            total: event.total,
            complete: event.loaded,
            status: "running",
          });
        }
      };

      // Set up completion handler
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          this.partStates[uniqueId].etag =
            xhr.getResponseHeader("ETag") ?? undefined;
          this.partStates[uniqueId].state = "complete";
          resolve();
        } else {
          this.partStates[uniqueId].error = `HTTP error: ${xhr.status}`;
          this.partStates[uniqueId].state = "error";
          this.setError({
            code: "UPLOAD_FAILED",
            message: `HTTP error: ${xhr.status}`,
            retryable: true,
            details: xhr,
          });
          reject(new Error(`HTTP error: ${xhr.status}`));
        }
      };

      // Set up error handler
      xhr.onerror = () => {
        this.partStates[uniqueId].error = "Network error";
        this.partStates[uniqueId].state = "error";
        this.setError({
          code: "UPLOAD_FAILED",
          message: "Network error",
          retryable: true,
          details: xhr,
        });
        reject(new Error("Network error"));
      };

      // Open and send the request
      xhr.open("PUT", part.meta.url);
      if (checksum) {
        xhr.setRequestHeader("Content-MD5", checksum);
      }
      xhr.send(part.payload);
      this.partStates[uniqueId].state = "uploading";
    });
  }

  async pause(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(this.partStates).forEach(([_key, value]) => {
      if (value.state === "uploading") {
        // TODO: Somehow stop the request
        value.state = "paused";
      }
    });
  }

  async resume(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(this.partStates).forEach(([_key, value]) => {
      if (value.state === "paused") {
        this.uploadPart(value.uniqueId, value.part, this.md5WorkerManager);
      }
    });
  }

  async abort(): Promise<void> {
    if (!this.handle) {
      throw new Error("Upload handle not found");
    }
    // TODO: This should probably change some status to aborted, so that the
    // frontend can show that the upload was aborted.
    await UsermediaEndpoints.abort(this.api, {
      uuid: this.handle.uuid,
      data: undefined,
    });
  }

  async retry(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(this.partStates).forEach(([_key, value]) => {
      if (value.state === "error") {
        this.uploadPart(value.uniqueId, value.part, this.md5WorkerManager);
      }
    });
  }
}
