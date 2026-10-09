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

export const MAX_CONCURRENT_MD5_WORKERS = 3;

export class MD5WorkerManager {
  private workers: Worker[] = [];
  private waiting: (() => void)[] = [];

  constructor() {
    if (typeof window === "undefined" || !window.Worker) {
      throw new Error(
        "Failed to initialize MD5 WorkerManager: Worker not supported"
      );
    }
  }

  terminateWorkers(): void {
    this.workers.forEach((worker) => {
      worker.terminate();
    });
    this.workers = [];
    this.waiting = [];
  }

  async calculateMD5(uniqueId: string, data: Blob): Promise<string> {
    while (this.workers.length >= MAX_CONCURRENT_MD5_WORKERS) {
      await new Promise<void>((resolve) => this.waiting.push(resolve));
    }

    let worker: Worker;
    try {
      worker = new Worker(new URL("./MD5Worker.js", import.meta.url), {
        type: "module",
      });
      this.workers.push(worker);
    } catch (error) {
      throw new Error(`Failed to initialize MD5 worker: ${error}`);
    }

    try {
      return await new Promise<string>((resolve, reject) => {
        worker.onmessage = (event: MessageEvent) => {
          const typeCastedEvent = event.data as MD5CompleteEvent | MD5ErrorEvent;
          if (typeCastedEvent.uniqueId === uniqueId) {
            if (typeCastedEvent.type === "complete") {
              resolve(typeCastedEvent.md5);
            } else if (typeCastedEvent.type === "error") {
              reject(new Error(`MD5 worker error: ${typeCastedEvent.error}`));
            } else {
              reject(new Error("Unknown event type"));
            }
          }
        };

        worker.postMessage({
          type: "calculate",
          uniqueId,
          data,
        });
      });
    } finally {
      worker.terminate();
      this.workers = this.workers.filter((w) => w !== worker);
      this.waiting.shift()?.();
    }
  }
}
