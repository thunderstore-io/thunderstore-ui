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
  }

  calculateMD5(uniqueId: string, data: Blob): Promise<string> {
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
    return new Promise((resolve, reject) => {
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
  }
}
