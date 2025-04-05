import { TypedEventEmitter } from "@thunderstore/typed-event-emitter";

export type MD5CompleteEvent = {
  md5: string;
};

export type MD5ErrorEvent = {
  error: string;
};

export class MD5WorkerManager {
  private worker: Worker | null = null;
  private isInitialized = false;

  readonly onComplete = new TypedEventEmitter<MD5CompleteEvent>();
  readonly onError = new TypedEventEmitter<MD5ErrorEvent>();

  constructor() {
    // this.workerUrl = workerUrl;
  }

  initialize(): void {
    if (this.isInitialized || typeof window === "undefined" || !window.Worker) {
      return;
    }

    try {
      // this.worker = new Worker(this.workerUrl);
      this.worker = new Worker(new URL("./MD5Worker.js", import.meta.url), {
        type: "module",
      });
      this.worker.onmessage = this.handleWorkerMessage.bind(this);
      this.worker.onerror = this.handleWorkerError.bind(this);
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize MD5 worker:", error);
    }
  }

  terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.isInitialized = false;
    }
  }

  calculateMD5(data: Blob): Promise<string> {
    if (!this.worker || !this.isInitialized) {
      return Promise.reject(new Error("MD5 worker not initialized"));
    }

    return new Promise((resolve, reject) => {
      const completeListener = this.onComplete.addListener((event) => {
        completeListener();
        errorListener();
        resolve(event.md5);
      });

      const errorListener = this.onError.addListener((event) => {
        completeListener();
        errorListener();
        reject(new Error(event.error));
      });

      this.worker!.postMessage({
        type: "calculate",
        data,
      });
    });
  }

  private handleWorkerMessage(event: MessageEvent): void {
    const { type } = event.data;

    switch (type) {
      case "complete":
        this.onComplete.emit({
          md5: event.data.md5,
        });
        break;
      case "error":
        this.onError.emit({
          error: event.data.error,
        });
        break;
    }
  }

  private handleWorkerError(error: ErrorEvent): void {
    console.error("MD5 worker error:", error);
    this.onError.emit({
      error: error.message || "Unknown error in MD5 worker",
    });
  }
}
