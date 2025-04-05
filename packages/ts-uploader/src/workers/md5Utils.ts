import { getMD5WorkerManager } from "./workerUtils";

/**
 * Calculates the MD5 hash of a blob using a web worker
 * @param blob The blob to calculate the MD5 hash for
 * @returns A promise that resolves to the MD5 hash as a Base64 string
 */
export async function calculateMD5(blob: Blob): Promise<string> {
  const workerManager = getMD5WorkerManager();
  return workerManager.calculateMD5(blob);
}
