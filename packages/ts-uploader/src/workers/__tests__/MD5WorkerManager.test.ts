import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MD5WorkerManager } from "../MD5WorkerManager";

describe("MD5WorkerManager", () => {
  let manager: MD5WorkerManager;
  const mockWorker: Worker = {
    onmessage: null,
    // @ts-expect-error Mocking Worker methods
    postMessage: vi.fn(),
    terminate: vi.fn(),
  };

  beforeEach(() => {
    // Mock Worker
    global.Worker = vi.fn().mockImplementation(() => mockWorker);
    manager = new MD5WorkerManager();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("initialize", () => {
    it("should initialize the worker manager", () => {
      manager.initialize();
      expect(global.Worker).toHaveBeenCalled();
    });

    it("should not initialize if already initialized", () => {
      manager.initialize();
      const initialCallCount = vi.mocked(global.Worker).mock.calls.length;

      manager.initialize();
      expect(vi.mocked(global.Worker).mock.calls.length).toBe(initialCallCount);
    });

    it("should not initialize if Worker is not available", () => {
      const originalWorker = global.Worker;
      // @ts-expect-error Simulate Worker not being available
      delete global.Worker;

      manager.initialize();
      expect(vi.mocked(console.error)).not.toHaveBeenCalled();

      global.Worker = originalWorker;
    });
  });

  describe("calculateMD5", () => {
    it("should calculate MD5 hash for a blob", async () => {
      const blob = new Blob(["test content"]);
      const uniqueId = "test-id";

      // Set up the worker's onmessage handler
      mockWorker.onmessage = ({ data }) => {
        if (data.uniqueId === uniqueId) {
          mockWorker.onmessage = null;
        }
      };

      const hash = await manager.calculateMD5(uniqueId, blob);

      expect(hash).toBe("mock-md5-hash");
      expect(mockWorker.postMessage).toHaveBeenCalledWith({
        type: "calculate",
        uniqueId,
        data: blob,
      });
    });

    it("should handle worker errors", async () => {
      const blob = new Blob(["test content"]);
      const uniqueId = "test-id";

      // Set up the worker's onmessage handler
      mockWorker.onmessage = ({ data }) => {
        if (data.uniqueId === uniqueId) {
          mockWorker.onmessage = null;
        }
      };

      await expect(manager.calculateMD5(uniqueId, blob)).rejects.toThrow(
        "MD5 worker error: Calculation failed"
      );
    });

    it("should throw error if not initialized", () => {
      const blob = new Blob(["test content"]);
      const uniqueId = "test-id";

      expect(() => manager.calculateMD5(uniqueId, blob)).toThrow(
        "MD5 worker not initialized"
      );
    });
  });

  describe("terminateWorkers", () => {
    it("should terminate all workers", () => {
      manager.initialize();
      manager.terminateWorkers();

      expect(mockWorker.terminate).toHaveBeenCalled();
      expect(manager["workers"]).toHaveLength(0);
    });
  });
});
