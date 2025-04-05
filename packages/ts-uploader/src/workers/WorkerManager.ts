import { TypedEventEmitter } from "@thunderstore/typed-event-emitter";

export type WorkerProgressEvent = {
  partNumber: number;
  loaded: number;
  total: number;
};

export type WorkerCompleteEvent = {
  partNumber: number;
  etag: string;
};

export type WorkerErrorEvent = {
  partNumber: number;
  error: string;
};

export class WorkerManager {
  private worker: Worker | null = null;
  private isInitialized = false;

  readonly onProgress = new TypedEventEmitter<WorkerProgressEvent>();
  readonly onComplete = new TypedEventEmitter<WorkerCompleteEvent>();
  readonly onError = new TypedEventEmitter<WorkerErrorEvent>();

  constructor() {
    // this.workerUrl = workerUrl;
  }

  initialize(): void {
    if (this.isInitialized || typeof window === "undefined" || !window.Worker) {
      return;
    }

    try {
      // this.worker = new Worker(this.workerUrl);
      this.worker = new Worker(new URL("./uploadWorker.js", import.meta.url), {
        type: "module",
      });
      this.worker.onmessage = this.handleWorkerMessage.bind(this);
      this.worker.onerror = this.handleWorkerError.bind(this);
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize worker:", error);
    }
  }

  terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.isInitialized = false;
    }
  }

  uploadPart(
    url: string,
    payload: Blob,
    partNumber: number,
    checksum?: string
  ): void {
    if (!this.worker || !this.isInitialized) {
      this.onError.emit({
        partNumber,
        error: "Worker not initialized",
      });
      return;
    }

    this.worker.postMessage({
      type: "upload",
      part: {
        url,
        payload,
        partNumber,
        checksum,
      },
    });
  }

  private handleWorkerMessage(event: MessageEvent): void {
    const { type, partNumber } = event.data;

    switch (type) {
      case "progress":
        this.onProgress.emit({
          partNumber,
          loaded: event.data.progress.loaded,
          total: event.data.progress.total,
        });
        break;
      case "complete":
        this.onComplete.emit({
          partNumber,
          etag: event.data.etag,
        });
        break;
      case "error":
        this.onError.emit({
          partNumber,
          error: event.data.error,
        });
        break;
    }
  }

  private handleWorkerError(error: ErrorEvent): void {
    console.error("Worker error:", error);
    // We don't know which part failed, so we can't emit a specific error
  }
}
