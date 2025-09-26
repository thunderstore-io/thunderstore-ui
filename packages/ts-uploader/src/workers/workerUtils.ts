import { MD5WorkerManager } from "./MD5WorkerManager";

// Create a function to create a blob URL for the MD5 worker
export function createMD5WorkerBlobUrl(): string {
  const workerScript = `
    importScripts("${new URL("./MD5Worker.js", import.meta.url).href}");
  `;

  const blob = new Blob([workerScript], { type: "application/javascript" });
  return URL.createObjectURL(blob);
}

// Singleton instances
let md5WorkerManager: MD5WorkerManager | null = null;

// Function to get the MD5 worker manager
export function getMD5WorkerManager(): MD5WorkerManager {
  if (!md5WorkerManager) {
    md5WorkerManager = new MD5WorkerManager();
  }
  return md5WorkerManager;
}

// Function to terminate all workers
export function terminateWorkers(): void {
  if (md5WorkerManager) {
    md5WorkerManager.terminateWorkers();
    md5WorkerManager = null;
  }
}
