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
    speedMatrix: [],
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
  readonly onError = new TypedEventEmitter<UploadError | undefined>();

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

  protected updateBytesPerSecond() {
    const bps = this.metrics.speedMatrix
      .slice((Math.min(this.metrics.speedMatrix.length, 10) - 1) * -1)
      .reduce(
        (acc, val, _currentIndex, arr) => {
          // console.log("asd", val[0] - arr[0][0]);
          return {
            time: acc.time + (val[0] - arr[0][0]),
            // time: acc.time + (val[0] - this.metrics.speedMatrix[0][0]),
            value: acc.value + val[1],
          };
        },
        { time: 0, value: 0 }
      );
    this.metrics.bytesPerSecond = bps.value / (bps.time / 1000);
    console.log("bps.value", bps.value);
    console.log("bps.time", bps.time);
    console.log("this.metrics.bytesPerSecond", this.metrics.bytesPerSecond);
  }

  get progress(): UploadProgress {
    this.updateBytesPerSecond();
    return {
      total: this.metrics.totalBytes,
      complete: this.metrics.uploadedBytes,
      status: this.status,
      metrics: this.metrics,
      error: this.error,
      partsProgress: this.partsProgress,
    };
  }

  protected updateTotalBytes() {
    this.metrics.totalBytes = Object.values(this.partsProgress).reduce(
      (acc, part) => acc + part.total,
      0
    );
  }

  protected updateUploadedBytes() {
    this.metrics.uploadedBytes = Object.values(this.partsProgress).reduce(
      (acc, part) => acc + part.complete,
      0
    );
  }

  addPart(uniqueId: string, partProgress: UploadPartProgress) {
    this.partsProgress[uniqueId] = partProgress;
    this.updateTotalBytes();
  }

  updateProgress(uniqueId: string, partProgress: UploadPartProgress) {
    const now = Date.now();
    this.partsProgress[uniqueId] = partProgress;
    const previousUploadedBytes = this.metrics.uploadedBytes;
    this.updateUploadedBytes();
    if (this.metrics.speedMatrix.length === 0) {
      this.metrics.startTime = now;
    }
    this.metrics.speedMatrix.push([
      now,
      this.metrics.uploadedBytes - previousUploadedBytes,
    ]);

    // const previousUploadedBytes = this.metrics.uploadedBytes;
    // const timeDiff = this.metrics.lastUpdateTime === 0 ? 1.01 : (now - this.metrics.lastUpdateTime) / 1000; // seconds
    // this.metrics.lastUpdateTime = now;

    // if (timeDiff > 1) {
    //   this.metrics.bytesPerSecondHistory =
    //     this.metrics.bytesPerSecondHistory.slice(-9);
    //   this.metrics.bytesPerSecondHistory.push({
    //     time: timeDiff,
    //     value: this.metrics.uploadedBytes - previousUploadedBytes,
    //   });
    //   const bps = this.metrics.bytesPerSecondHistory.reduce(
    //     (acc, val) => ({
    //       time: acc.time + val.time,
    //       value: acc.value + val.value,
    //     }),
    //     { time: 0, value: 0 }
    //   );
    //   this.metrics.bytesPerSecond = bps.value / bps.time;
    // }

    this.onProgress.emit(this.progress);
  }

  protected setStatus(newStatus: UploadStatus) {
    if (this.status !== newStatus) {
      this.status = newStatus;
      this.onStatusChange.emit(newStatus);
    }
  }

  protected setError(error?: UploadError) {
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
