import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MD5WorkerManager } from "../MD5WorkerManager";

describe("MD5WorkerManager", () => {
  let manager: MD5WorkerManager;

  beforeEach(() => {
    manager = new MD5WorkerManager();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("initialize", () => {
    it("should initialize the worker manager", () => {
      expect(manager).toBeTruthy();
    });

    it("should not throw if Worker is not available", () => {
      const originalWorker = window.Worker;
      expect(manager).toBeTruthy();
      // @ts-expect-error Simulate Worker not being available
      delete window.Worker;
      expect(manager).toBeTruthy();
      expect(() => new MD5WorkerManager()).toThrow(
        "Failed to initialize MD5 WorkerManager: Worker not supported"
      );
      window.Worker = originalWorker;
      expect(manager).toBeTruthy();
    });
  });

  describe("calculateMD5", () => {
    it("should calculate MD5 hash for a blob", async () => {
      const blob = new Blob(["test content"]);
      const uniqueId = "test-id";

      expect(await manager.calculateMD5(uniqueId, blob)).toBe(
        "lHP90NiApDwht3eNNIchVw=="
      );
    });
  });

  describe("terminateWorkers", () => {
    it("should terminate all workers", () => {
      manager.terminateWorkers();

      // Simulate adding workers
      for (let i = 0; i < 5; i++) {
        manager["workers"].push(
          new Worker(new URL("../MD5Worker.js", import.meta.url), {
            type: "module",
          })
        );
      }

      expect(manager["workers"]).toHaveLength(5);
      manager.terminateWorkers();
      for (const worker of manager["workers"]) {
        expect(vi.spyOn(worker, "terminate")).toHaveBeenCalled();
      }
      expect(manager["workers"]).toHaveLength(0);
    });
  });
});
