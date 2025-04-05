import { CompletedPart, UserMedia } from "../client/types";
import { UsermediaEndpoints } from "../client/endpoints";
import { ApiConfig } from "../client/config";
import {
  UploadProgress,
  UploadRequest,
  UploadRequestConfig,
} from "./UploadRequest";
import { TypedEventEmitter } from "@thunderstore/typed-event-emitter";
import { BaseUpload } from "./BaseUpload";
import { UploadConfig } from "./types";
import { getWorkerManager, getMD5WorkerManager } from "../workers";
import { calculateMD5 } from "../workers/md5Utils";

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

function slicePart(file: File, offset: number, length: number) {
  const start = offset;
  const end = offset + length;
  return end < file.size ? file.slice(start, end) : file.slice(start);
}

async function createUploadRequest<T>(
  part: UploadPart,
  onProgress: UploadRequestConfig<T>["onProgress"],
  transformer: UploadRequest<T>["transformer"]
): Promise<UploadRequest<T>> {
  // TODO: Async md5 calculation via either wasm or workers
  const md5 = await calculateMD5(part.payload);
  return new UploadRequest(
    {
      data: part.payload,
      md5: md5,
    },
    {
      url: part.meta.url,
      onProgress,
    },
    transformer
  );
}

export async function initMultipartUpload(
  file: File,
  opts: MultiPartUploadOptions
): Promise<UploadHandle> {
  const result = await UsermediaEndpoints.init(opts.api, {
    data: {
      filename: file.name,
      file_size_bytes: file.size,
    },
  });
  const parts: UploadPart[] = result.upload_urls.map((x) => ({
    payload: slicePart(file, x.offset, x.length),
    meta: x,
  }));
  return new UploadHandle(result.user_media, opts, parts);
}

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

class UploadHandle implements IUploadHandle {
  readonly handle: UserMedia;
  readonly opts: MultiPartUploadOptions;
  readonly parts: UploadPart[];
  readonly onProgress = new TypedEventEmitter<UploadProgress>();

  private requests?: UploadRequest<CompletedPart>[];

  constructor(
    handle: UserMedia,
    opts: MultiPartUploadOptions,
    parts: UploadPart[]
  ) {
    this.handle = handle;
    this.opts = opts;
    this.parts = parts;
  }

  get progress(): UploadProgress {
    return (this.requests || []).reduce(
      (state, request) => {
        return {
          total: state.total + request.progress.total,
          complete: state.complete + request.progress.complete,
        };
      },
      {
        total: 0,
        complete: 0,
      }
    );
  }

  private startRequests(count?: number) {
    if (this.requests == undefined) {
      throw new Error("Upload not yet prepared");
    }

    const promises = [];
    const candidates = this.requests.filter((x) => x.status === "pending");
    for (let i = 0; i < (count ?? candidates.length); i++) {
      if (i >= candidates.length) break;
      promises.push(candidates[i].upload());
    }
    return promises;
  }

  async startUpload(
    onProgress?: (
      progress: UploadProgress
    ) => ReturnType<typeof UsermediaEndpoints.finish>
  ) {
    if (this.requests != undefined) {
      throw new Error("Upload already initiated!");
    }

    const progressCallback = () => {
      const progress = this.progress;
      if (onProgress) onProgress(progress);
      this.onProgress.emit(progress);
    };

    this.requests = [];

    for (const part of this.parts) {
      const request = await createUploadRequest<CompletedPart>(
        part,
        progressCallback,
        (response) => {
          const etag = response.headers.get("etag");
          if (!etag) {
            // ETag is filtered out by some browser extensions
            // TODO: Handle somehow better
            throw new Error("ETag header was missing from the response!");
          }
          return {
            ETag: etag,
            PartNumber: part.meta.part_number,
          };
        }
      );
      this.requests.push(request);
    }

    const parts = await Promise.all(this.startRequests());
    return UsermediaEndpoints.finish(this.opts.api, {
      data: { parts },
      uuid: this.handle.uuid,
    });
  }
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

      this.handle = result.user_media;

      // Create parts
      this.parts = result.upload_urls.map((x) => ({
        payload: this.slicePart(x.offset, x.length),
        meta: {
          part_number: x.part_number,
          url: x.url,
        },
      }));

      // Upload parts concurrently
      const maxConcurrent = this.config.maxConcurrentParts ?? 3;
      for (let i = 0; i < this.parts.length; i += maxConcurrent) {
        const batch = this.parts.slice(i, i + maxConcurrent);
        await Promise.all(batch.map((part) => this.uploadPart(part)));
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

  private async uploadPart(part: UploadPart): Promise<void> {
    if (this.isAborted) {
      throw new Error("Upload aborted");
    }

    const controller = new AbortController();
    this.activeControllers.push(controller);

    try {
      // Calculate checksum using the MD5 worker
      const md5WorkerManager = getMD5WorkerManager();
      const checksum = await md5WorkerManager.calculateMD5(part.payload);

      // Use the worker manager to upload the part
      const workerManager = getWorkerManager();

      // Set up event listeners for the worker
      const progressListener = workerManager.onProgress.addListener((event) => {
        if (event.partNumber === part.meta.part_number) {
          // Update progress for this part
          const partSize = this.file.size / this.parts.length;
          const partProgress = (event.loaded / event.total) * partSize;
          const totalProgress =
            this.completedParts.length * partSize + partProgress;
          this.updateProgress(totalProgress);
        }
      });

      // Create a promise to wait for the upload to complete
      await new Promise<void>((resolve, reject) => {
        const completeListener = workerManager.onComplete.addListener(
          (event) => {
            if (event.partNumber === part.meta.part_number) {
              // Remove listeners
              progressListener();
              completeListener();
              errorListener();

              // Add the completed part
              this.completedParts.push({
                ETag: event.etag,
                PartNumber: part.meta.part_number,
              });

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
          if (event.partNumber === part.meta.part_number) {
            // Remove listeners
            progressListener();
            completeListener();
            errorListener();

            reject(new Error(event.error));
          }
        });

        // Start the upload using the worker
        workerManager.uploadPart(
          part.meta.url,
          part.payload,
          part.meta.part_number,
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
