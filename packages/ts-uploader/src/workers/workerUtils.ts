import { WorkerManager } from "./WorkerManager";
import { MD5WorkerManager } from "./MD5WorkerManager";

// Create a function to create a blob URL for the upload worker
export function createUploadWorkerBlobUrl(): string {
  const workerScript = `
    importScripts("${new URL("./uploadWorker.js", import.meta.url).href}");
  `;

  const blob = new Blob([workerScript], { type: "application/javascript" });
  return URL.createObjectURL(blob);
}

// Create a function to create a blob URL for the MD5 worker
export function createMD5WorkerBlobUrl(): string {
  const workerScript = `
    importScripts("${new URL("./MD5Worker.js", import.meta.url).href}");
  `;

  const blob = new Blob([workerScript], { type: "application/javascript" });
  return URL.createObjectURL(blob);
}

// Singleton instances
let uploadWorkerManager: WorkerManager | null = null;
let md5WorkerManager: MD5WorkerManager | null = null;

// Function to get the upload worker manager
export function getWorkerManager(): WorkerManager {
  if (!uploadWorkerManager) {
    uploadWorkerManager = new WorkerManager();
    uploadWorkerManager.initialize();
  }
  return uploadWorkerManager;
}

// Function to get the MD5 worker manager
export function getMD5WorkerManager(): MD5WorkerManager {
  if (!md5WorkerManager) {
    md5WorkerManager = new MD5WorkerManager();
    md5WorkerManager.initialize();
  }
  return md5WorkerManager;
}

// Function to terminate all workers
export function terminateWorkers(): void {
  if (uploadWorkerManager) {
    uploadWorkerManager.terminate();
    uploadWorkerManager = null;
  }
  if (md5WorkerManager) {
    md5WorkerManager.terminate();
    md5WorkerManager = null;
  }
}
