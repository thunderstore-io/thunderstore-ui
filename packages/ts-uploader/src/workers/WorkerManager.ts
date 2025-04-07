import { TypedEventEmitter } from "@thunderstore/typed-event-emitter";

export type WorkerProgressEvent = {
  uniqueId: string;
  progress: number;
};

export type WorkerCompleteEvent = {
  uniqueId: string;
  etag: string;
};

export type WorkerErrorEvent = {
  uniqueId: string;
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
    uniqueId: string,
    checksum?: string
  ): void {
    if (!this.worker || !this.isInitialized) {
      this.onError.emit({
        uniqueId,
        error: "Worker not initialized",
      });
      return;
    }

    console.log("uploadPartasdasd", url, payload, uniqueId, checksum);

    this.worker.postMessage({
      type: "upload",
      part: {
        url,
        payload,
        uniqueId,
        checksum,
      },
    });
  }

  private handleWorkerMessage(event: MessageEvent): void {
    const { type, uniqueId, progress, etag, error } = event.data;

    switch (type) {
      case "progress":
        this.onProgress.emit({
          uniqueId,
          progress,
        });
        break;
      case "complete":
        console.log("complete", event.data);
        this.onComplete.emit({
          uniqueId,
          etag,
        });
        break;
      case "error":
        this.onError.emit({
          uniqueId,
          error,
        });
        break;
    }
  }

  private handleWorkerError(error: ErrorEvent): void {
    console.error("Worker error:", error);
    // We don't know which part failed, so we can't emit a specific error
  }
}
