import { UserMedia } from "../client/types";
import { UsermediaEndpoints } from "../client/endpoints";
import { ApiConfig } from "../client/config";
import { UploadProgress } from "./UploadRequest";
import { TypedEventEmitter } from "@thunderstore/typed-event-emitter";
import { BaseUpload } from "./BaseUpload";
import { UploadConfig } from "./types";
import {
  getWorkerManager,
  getMD5WorkerManager,
  MD5WorkerManager,
  WorkerManager,
} from "../workers";

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
  private activeControllers: AbortController[] = [];
  private completedParts: { ETag: string; PartNumber: number }[] = [];
  private handle?: UserMedia;

  constructor(options: MultiPartUploadOptions, config?: UploadConfig) {
    super(config);
    this.file = options.file;
    this.api = options.api;
    this.metrics.totalBytes = this.file.size;
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
      const result = await UsermediaEndpoints.init(this.api, {
        data: {
          filename: this.file.name,
          file_size_bytes: this.file.size,
        },
      });

      // console.log(result);

      this.handle = result.user_media;

      // Create parts
      this.parts = result.upload_urls.map((x) => ({
        payload: this.slicePart(x.offset, x.length),
        meta: {
          part_number: x.part_number,
          url: x.url,
        },
      }));

      const md5WorkerManager = getMD5WorkerManager();
      const workerManager = getWorkerManager();

      // Upload parts concurrently
      const maxConcurrent = this.config.maxConcurrentParts ?? 3;
      for (let i = 0; i < this.parts.length; i += maxConcurrent) {
        // console.log(i);
        const batch = this.parts.slice(i, i + maxConcurrent);
        // console.log(batch);
        // await Promise.all(
        //   batch.map((part) => this.uploadPart(md5WorkerManager, part))
        // );
        await Promise.all(
          batch.map((part) => {
            console.log(part);
            return this.uploadPart(md5WorkerManager, workerManager, part);
          })
        );
      }

      // Complete upload
      await UsermediaEndpoints.finish(this.api, {
        data: { parts: this.completedParts },
        uuid: result.user_media.uuid,
      });

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

  private async uploadPart(
    md5WorkerManager: MD5WorkerManager,
    workerManager: WorkerManager,
    part: UploadPart
  ): Promise<void> {
    if (this.isAborted) {
      throw new Error("Upload aborted");
    }

    const controller = new AbortController();
    this.activeControllers.push(controller);

    // console.log(part);

    try {
      // Calculate checksum using the MD5 worker

      if (!this.handle) {
        throw new Error("Upload handle not found");
      }

      const uniqueId = `${this.handle.uuid}-${part.meta.part_number}`;

      const checksum = await md5WorkerManager.calculateMD5(
        uniqueId,
        part.payload
      );
      console.log(checksum);

      // Use the worker manager to upload the part

      // Set up event listeners for the worker
      const progressListener = workerManager.onProgress.addListener((event) => {
        if (event.uniqueId === uniqueId) {
          // Update progress for this part
          const partSize = this.file.size / this.parts.length;
          const partProgress = event.progress * partSize;
          const totalProgress =
            this.completedParts.length * partSize + partProgress;
          this.updateProgress(totalProgress);
        }
      });

      console.log("uploadPfasfafasart", uniqueId);
      // Create a promise to wait for the upload to complete
      await new Promise<void>((resolve, reject) => {
        const completeListener = workerManager.onComplete.addListener(
          (event) => {
            // console.log("completeListener", event);
            if (event.uniqueId === uniqueId) {
              // Remove listeners
              progressListener();
              completeListener();
              errorListener();

              console.log("completedPart", event.etag);
              // Add the completed part
              this.completedParts.push({
                ETag: event.etag,
                PartNumber: part.meta.part_number,
              });
              // console.log(this.completedParts);

              // Update progress
              this.updateProgress(
                this.completedParts.length *
                  (this.file.size / this.parts.length)
              );

              resolve();
            }
          }
        );

        const errorListener = workerManager.onError.addListener((event) => {
          if (event.uniqueId === uniqueId) {
            // Remove listeners
            progressListener();
            completeListener();
            errorListener();

            reject(new Error(event.error));
          }
        });

        console.log(
          "uploadPart",
          part.meta.url,
          part.payload,
          part.meta.part_number,
          checksum
        );
        // Start the upload using the worker
        workerManager.uploadPart(
          part.meta.url,
          part.payload,
          uniqueId,
          checksum
        );
      });
    } finally {
      const index = this.activeControllers.indexOf(controller);
      if (index > -1) {
        this.activeControllers.splice(index, 1);
      }
    }
  }

  async pause(): Promise<void> {
    if (this.status !== "running") {
      throw new Error("Upload is not running");
    }
    this.activeControllers.forEach((controller) => controller.abort());
    this.setStatus("paused");
  }

  async resume(): Promise<void> {
    if (this.status !== "paused") {
      throw new Error("Upload is not paused");
    }
    await this.start();
  }

  async abort(): Promise<void> {
    this.activeControllers.forEach((controller) => controller.abort());
    this.isAborted = true;
    this.setStatus("aborted");
  }

  async retry(): Promise<void> {
    if (this.status === "running") {
      throw new Error("Upload is already running");
    }
    this.error = undefined;
    this.completedParts = [];
    await this.start();
  }
}
