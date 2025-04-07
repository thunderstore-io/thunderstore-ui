// import { TypedEventEmitter } from "@thunderstore/typed-event-emitter";

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

  // readonly onComplete = new TypedEventEmitter<MD5CompleteEvent>();
  // readonly onError = new TypedEventEmitter<MD5ErrorEvent>();

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
      return Promise.reject(new Error("MD5 worker not initialized"));
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
      console.error("Failed to initialize MD5 worker:", error);
    }

    return new Promise((resolve, reject) => {
      worker!.onmessage = (event: MessageEvent) => {
        console.log("calculateMD5 onmessage", event);
        const typeCastedEvent = event.data as MD5CompleteEvent | MD5ErrorEvent;
        if (typeCastedEvent.uniqueId === uniqueId) {
          if (typeCastedEvent.type === "complete") {
            resolve(typeCastedEvent.md5);
          } else if (typeCastedEvent.type === "error") {
            reject(new Error(typeCastedEvent.error));
          } else {
            reject(new Error("Unknown event type"));
          }
        }
      };

      // this.worker!.onerror = (event: MessageEvent) => {
      //   console.log("calculateMD5 onerror", event);
      //   const typeCastedEvent = event.data as MD5ErrorEvent;
      //   if (typeCastedEvent.type === "error") {
      //     if (typeCastedEvent.uniqueId === uniqueId) {
      //       reject(new Error(typeCastedEvent.error));
      //     }
      //   }
      // };

      // const completeListener = this.onComplete.addListener((event) => {
      //   if (event.uniqueId === uniqueId) {
      //     completeListener();
      //     errorListener();
      //     resolve(event.md5);
      //   }
      // });

      // const errorListener = this.onError.addListener((event) => {
      //   if (event.uniqueId === uniqueId) {
      //     completeListener();
      //     errorListener();
      //     reject(new Error(event.error));
      //   }
      // });

      worker!.postMessage({
        type: "calculate",
        uniqueId,
        data,
      });
    });
  }

  // private handleWorkerMessage(event: MD5CompleteEvent): void {
  //   const { type, uniqueId, md5 } = event;

  //   switch (type) {
  //     case "complete":
  //       this.onComplete.emit({
  //         type: "complete",
  //         uniqueId,
  //         md5,
  //       });
  //       break;
  //     case "error":
  //       this.onError.emit({
  //         type: "error",
  //         uniqueId,
  //         error,
  //       });
  //       break;
  //   }
  // }

  // private handleWorkerError(event: MD5ErrorEvent): void {
  //   this.onError.emit({
  //     type: "error",
  //     error: event.error || "Unknown error in MD5 worker",
  //     uniqueId: event.uniqueId,
  //   });
  // }
}
