import { TypedEventEmitter } from "@thunderstore/typed-event-emitter";
import {
  IBaseUploadHandle,
  UploadConfig,
  UploadError,
  UploadMetrics,
  UploadPartProgress,
  UploadProgress,
  UploadStatus,
} from "./types";

export abstract class BaseUpload implements IBaseUploadHandle {
  protected status: UploadStatus = "not_started";
  protected metrics: UploadMetrics = {
    bytesPerSecondHistory: [],
    bytesPerSecond: 0,
    totalBytes: 0,
    uploadedBytes: 0,
    startTime: 0,
    lastUpdateTime: 0,
    retryCount: 0,
  };
  protected error?: UploadError;
  protected partsProgress: { [key: string]: UploadPartProgress } = {};
  protected config: UploadConfig;
  protected isAborted = false;

  readonly onProgress = new TypedEventEmitter<UploadProgress>();
  readonly onStatusChange = new TypedEventEmitter<UploadStatus>();
  readonly onError = new TypedEventEmitter<UploadError>();

  constructor(config: UploadConfig = {}) {
    this.config = {
      maxRetries: 3,
      retryDelay: 1000,
      maxConcurrentUploads: 3,
      checksumAlgorithm: "md5",
      timeout: 30000,
      ...config,
    };
    this.partsProgress = {};
  }

  get progress(): UploadProgress {
    return {
      total: this.metrics.totalBytes,
      complete: this.metrics.uploadedBytes,
      status: this.status,
      metrics: this.metrics,
      error: this.error,
      partsProgress: this.partsProgress,
    };
  }

  protected updateProgress(uniqueId: string, partProgress: UploadPartProgress) {
    const now = Date.now();
    this.partsProgress[uniqueId] = partProgress;

    const previousUploadedBytes = this.metrics.uploadedBytes;

    this.metrics.uploadedBytes = Object.values(this.partsProgress).reduce(
      (acc, part) => acc + part.complete,
      0
    );

    const timeDiff = (now - this.metrics.lastUpdateTime) / 1000; // seconds
    if (timeDiff > 1) {
      this.metrics.bytesPerSecondHistory =
        this.metrics.bytesPerSecondHistory.slice(-9);
      this.metrics.bytesPerSecondHistory.push({
        time: timeDiff,
        value: this.metrics.uploadedBytes - previousUploadedBytes,
      });
      const bps = this.metrics.bytesPerSecondHistory.reduce(
        (acc, val) => ({
          time: acc.time + val.time,
          value: acc.value + val.value,
        }),
        { time: 0, value: 0 }
      );
      this.metrics.bytesPerSecond = bps.value / bps.time;
      this.metrics.lastUpdateTime = now;
    }
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

  // TODO: Take this into use
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
