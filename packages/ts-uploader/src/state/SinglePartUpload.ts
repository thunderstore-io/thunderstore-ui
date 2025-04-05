import { ApiConfig } from "../client/config";
import { UsermediaEndpoints } from "../client/endpoints";
import { calculateMD5 } from "../workers/md5Utils";
import { BaseUpload } from "./BaseUpload";
import { UploadConfig } from "./types";

export type SinglePartUploadOptions = {
  api: ApiConfig;
  file: File;
};

export class SinglePartUpload extends BaseUpload {
  private file: File;
  private api: ApiConfig;
  private uploadUrl?: string;
  private controller?: AbortController;

  constructor(options: SinglePartUploadOptions, config?: UploadConfig) {
    super(config);
    this.file = options.file;
    this.api = options.api;
    this.metrics.totalBytes = this.file.size;
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

      this.uploadUrl = result.upload_urls[0].url;

      // Calculate checksum
      const checksum = await calculateMD5(this.file);

      // Upload file
      await this.retryWithBackoff(async () => {
        this.controller = new AbortController();
        const response = await fetch(this.uploadUrl!, {
          method: "PUT",
          headers: {
            "Content-MD5": checksum,
          },
          body: this.file,
          signal: this.controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Upload failed with status: ${response.status}`);
        }
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
      throw error;
    }
  }

  async pause(): Promise<void> {
    if (this.status !== "running") {
      throw new Error("Upload is not running");
    }
    this.controller?.abort();
    this.setStatus("paused");
  }

  async resume(): Promise<void> {
    if (this.status !== "paused") {
      throw new Error("Upload is not paused");
    }
    await this.start();
  }

  async abort(): Promise<void> {
    this.controller?.abort();
    this.isAborted = true;
    this.setStatus("aborted");
  }

  async retry(): Promise<void> {
    if (this.status === "running") {
      throw new Error("Upload is already running");
    }
    this.error = undefined;
    await this.start();
  }
}
