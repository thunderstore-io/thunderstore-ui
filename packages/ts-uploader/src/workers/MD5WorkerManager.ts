export type MD5CompleteEvent = {
  type: "complete";
  md5: string;
  uniqueId: string;
};

export type MD5ErrorEvent = {
  type: "error";
  error: string;
  uniqueId: string;
};

export class MD5WorkerManager {
  private workers: Worker[] = [];
  private isInitialized = false;

  constructor() {
    // this.namespace = namespace;
  }

  initialize(): void {
    if (this.isInitialized || typeof window === "undefined" || !window.Worker) {
      return;
    }

    try {
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize MD5 WorkerManager:", error);
    }
  }

  terminateWorkers(): void {
    this.workers.forEach((worker) => {
      worker.terminate();
    });
    this.workers = [];
    this.isInitialized = false;
  }

  calculateMD5(uniqueId: string, data: Blob): Promise<string> {
    if (!this.isInitialized) {
      throw new Error("MD5 worker not initialized");
    }

    let worker: Worker | null = null;

    try {
      // this.worker = new Worker(this.workerUrl);
      worker = new Worker(new URL("./MD5Worker.js", import.meta.url), {
        type: "module",
      });
      if (!worker) {
        throw new Error("Failed to create MD5 worker");
      }
      this.workers.push(worker);
    } catch (error) {
      throw new Error(`Failed to initialize MD5 worker: ${error}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new Promise((resolve, _reject) => {
      worker!.onmessage = (event: MessageEvent) => {
        const typeCastedEvent = event.data as MD5CompleteEvent | MD5ErrorEvent;
        if (typeCastedEvent.uniqueId === uniqueId) {
          if (typeCastedEvent.type === "complete") {
            resolve(typeCastedEvent.md5);
          } else if (typeCastedEvent.type === "error") {
            throw new Error(`MD5 worker error: ${typeCastedEvent.error}`);
          } else {
            throw new Error("Unknown event type");
          }
        }
      };

      worker!.postMessage({
        type: "calculate",
        uniqueId,
        data,
      });
    });
  }
}
