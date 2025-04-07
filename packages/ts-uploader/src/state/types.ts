import { TypedEventEmitter } from "@thunderstore/typed-event-emitter";

export type UploadType = "single" | "multipart";

export type UploadStatus =
  | "pending"
  | "running"
  | "paused"
  | "complete"
  | "failed"
  | "aborted";

export type UploadError = {
  code: string;
  message: string;
  retryable: boolean;
  details?: unknown;
};

export type UploadMetrics = {
  bytesPerSecondHistory: { time: number; value: number }[];
  bytesPerSecond: number;
  totalBytes: number;
  uploadedBytes: number;
  startTime: number;
  lastUpdateTime: number;
  retryCount: number;
};

export type UploadPartProgress = {
  total: number;
  complete: number;
  status: UploadStatus;
  error?: UploadError;
};

export type UploadProgress = {
  total: number;
  complete: number;
  status: UploadStatus;
  metrics: UploadMetrics;
  partsProgress: { [key: string]: UploadPartProgress };
  error?: UploadError;
};

export interface IBaseUploadHandle {
  get progress(): UploadProgress;
  onProgress: TypedEventEmitter<UploadProgress>;
  onStatusChange: TypedEventEmitter<UploadStatus>;
  onError: TypedEventEmitter<UploadError>;

  start(): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  abort(): Promise<void>;
  retry(): Promise<void>;
}

export type UploadConfig = {
  maxRetries?: number;
  retryDelay?: number;
  maxConcurrentParts?: number;
  bandwidthLimit?: number; // bytes per second
  checksumAlgorithm?: "md5" | "sha256";
  timeout?: number;
};
