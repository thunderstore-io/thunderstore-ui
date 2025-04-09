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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface MD5WorkerManagerError extends Error {}

interface MD5WorkerManagerErrorConstructor extends ErrorConstructor {
  new (message?: string): MD5WorkerManagerError;
  (message?: string): MD5WorkerManagerError;
  readonly prototype: MD5WorkerManagerError;
}

// eslint-disable-next-line no-var
export declare var MD5WorkerManagerError: MD5WorkerManagerErrorConstructor;

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

  calculateMD5(
    uniqueId: string,
    data: Blob
  ): Promise<string | MD5WorkerManagerError> {
    if (!this.isInitialized) {
      return Promise.reject(
        new MD5WorkerManagerError("MD5 worker not initialized")
      );
    }

    let worker: Worker | null = null;

    try {
      // this.worker = new Worker(this.workerUrl);
      worker = new Worker(new URL("./MD5Worker.js", import.meta.url), {
        type: "module",
      });
      if (!worker) {
        return Promise.reject(
          new MD5WorkerManagerError("Failed to create MD5 worker")
        );
      }
      this.workers.push(worker);
    } catch (error) {
      return Promise.reject(
        new MD5WorkerManagerError(`Failed to initialize MD5 worker: ${error}`)
      );
    }

    return new Promise((resolve, reject) => {
      worker!.onmessage = (event: MessageEvent) => {
        const typeCastedEvent = event.data as MD5CompleteEvent | MD5ErrorEvent;
        if (typeCastedEvent.uniqueId === uniqueId) {
          if (typeCastedEvent.type === "complete") {
            resolve(typeCastedEvent.md5);
          } else if (typeCastedEvent.type === "error") {
            reject(
              new MD5WorkerManagerError(
                `MD5 worker error: ${typeCastedEvent.error}`
              )
            );
          } else {
            reject(new MD5WorkerManagerError("Unknown event type"));
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
