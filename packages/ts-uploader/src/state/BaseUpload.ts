import { TypedEventEmitter } from "@thunderstore/typed-event-emitter";
import {
  IBaseUploadHandle,
  UploadConfig,
  UploadError,
  UploadMetrics,
  UploadProgress,
  UploadStatus,
} from "./types";

export abstract class BaseUpload implements IBaseUploadHandle {
  protected status: UploadStatus = "pending";
  protected metrics: UploadMetrics = {
    bytesPerSecond: 0,
    totalBytes: 0,
    uploadedBytes: 0,
    startTime: 0,
    lastUpdateTime: 0,
    retryCount: 0,
  };
  protected error?: UploadError;
  protected config: UploadConfig;
  protected isAborted = false;

  readonly onProgress = new TypedEventEmitter<UploadProgress>();
  readonly onStatusChange = new TypedEventEmitter<UploadStatus>();
  readonly onError = new TypedEventEmitter<UploadError>();

  constructor(config: UploadConfig = {}) {
    this.config = {
      maxRetries: 3,
      retryDelay: 1000,
      maxConcurrentParts: 3,
      checksumAlgorithm: "md5",
      timeout: 30000,
      ...config,
    };
  }

  get progress(): UploadProgress {
    return {
      total: this.metrics.totalBytes,
      complete: this.metrics.uploadedBytes,
      status: this.status,
      metrics: this.metrics,
      error: this.error,
    };
  }

  protected updateProgress(bytes: number) {
    const now = Date.now();
    const timeDiff = (now - this.metrics.lastUpdateTime) / 1000; // seconds
    if (timeDiff > 0) {
      this.metrics.bytesPerSecond =
        (bytes - this.metrics.uploadedBytes) / timeDiff;
    }
    this.metrics.uploadedBytes = bytes;
    this.metrics.lastUpdateTime = now;
    this.onProgress.emit(this.progress);
  }

  protected setStatus(newStatus: UploadStatus) {
    if (this.status !== newStatus) {
      this.status = newStatus;
      this.onStatusChange.emit(newStatus);
    }
  }

  protected setError(error: UploadError) {
    this.error = error;
    this.onError.emit(error);
  }

  protected async retryWithBackoff<T>(
    operation: () => Promise<T>,
    retryCount = 0
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retryCount >= (this.config.maxRetries ?? 3)) {
        throw error;
      }
      await new Promise((resolve) =>
        setTimeout(
          resolve,
          (this.config.retryDelay ?? 1000) * Math.pow(2, retryCount)
        )
      );
      return this.retryWithBackoff(operation, retryCount + 1);
    }
  }

  abstract start(): Promise<void>;
  abstract pause(): Promise<void>;
  abstract resume(): Promise<void>;
  abstract abort(): Promise<void>;
  abstract retry(): Promise<void>;
}
