import { RequestConfig } from "@thunderstore/thunderstore-api";
import { TypedEventEmitter } from "@thunderstore/typed-event-emitter";

import {
  CompletePartState,
  PartState,
  PreparedPartState,
} from "./MultipartUpload";

export type UploadType = "single" | "multipart";

export type UploadStatus =
  | "not_started"
  | "pending"
  | "running"
  | "paused"
  | "complete"
  | "failed"
  | "aborted";

export type UploadPartStatus =
  | "prepared"
  | "pending"
  | "running"
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
  speedMatrix: [number, number][];
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
  status: UploadPartStatus;
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
  onError: TypedEventEmitter<UploadError | undefined>;

  start(): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  abort(): Promise<void>;
  retry(): Promise<void>;
}

export type UploadConfig = {
  maxRetries?: number;
  retryDelay?: number;
  maxConcurrentUploads?: number;
  bandwidthLimit?: number; // bytes per second
  checksumAlgorithm?: "md5" | "sha256";
  timeout?: number;
};

export type MultiPartUploadOptions = {
  file: File;
  maxConcurrentUploads?: number;
  bandwidthLimit?: number;
};

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

export type GenericApiError = {
  detail?: string;
};

export type UserMedia = {
  uuid: string;
  datetime_created: string;
  expiry: string;
  status: string;
  filename: string;
  size: number;
  error?: string;
};
export type UploadPartUrl = {
  part_number: number;
  url: string;
  offset: number;
  length: number;
};
export type CompletedPart = {
  ETag: string;
  PartNumber: number;
};

export type InitUploadRequest = {
  filename: string;
  file_size_bytes: number;
};
export type InitUploadResponse = {
  user_media: UserMedia;
  upload_urls: UploadPartUrl[];
};

export type FinishUploadRequest = {
  parts: CompletedPart[];
};

// New stuff

export type Upload = {
  requestConfig: () => RequestConfig;
  usermedia: UserMedia;
  partStates: PartState[];
};

export type PreparedUpload = {
  requestConfig: () => RequestConfig;
  usermedia: UserMedia;
  partStates: PreparedPartState[];
};

export type CompleteUpload = {
  requestConfig: () => RequestConfig;
  usermedia: UserMedia;
  partStates: CompletePartState[];
};

export type FinalizedUpload = {
  requestConfig: () => RequestConfig;
  usermedia: Omit<UserMedia, "status"> & {
    status: "complete";
  };
  partStates: CompletePartState[];
};

export type UploadPartError = {
  code: string;
  message: string;
  retryable: boolean;
  details: XMLHttpRequest;
};
