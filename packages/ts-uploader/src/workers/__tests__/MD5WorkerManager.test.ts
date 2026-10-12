import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  MAX_CONCURRENT_MD5_WORKERS,
  MD5WorkerManager,
} from "../MD5WorkerManager";

describe("MD5WorkerManager", () => {
  let manager: MD5WorkerManager;

  beforeEach(() => {
    manager = new MD5WorkerManager();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  describe("initialize", () => {
    it("should initialize the worker manager", () => {
      expect(manager).toBeTruthy();
    });

    it("should throw if Worker is not available", () => {
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

    it("should terminate the worker once the hash is done", async () => {
      const terminateSpy = vi.spyOn(Worker.prototype, "terminate");

      await manager.calculateMD5("done-id", new Blob(["test content"]));

      expect(terminateSpy).toHaveBeenCalledTimes(1);
      expect(manager["workers"]).toHaveLength(0);
    });

    it("should queue calls beyond the concurrency cap", async () => {
      class FakeWorker {
        static all: FakeWorker[] = [];
        onmessage?: (event: MessageEvent) => void;
        id = "";
        constructor() {
          FakeWorker.all.push(this);
        }
        postMessage(message: { uniqueId: string }) {
          this.id = message.uniqueId;
        }
        complete() {
          const data = { type: "complete", uniqueId: this.id, md5: this.id };
          this.onmessage?.({ data } as MessageEvent);
        }
        terminate() {}
      }
      vi.stubGlobal("Worker", FakeWorker);

      const cap = MAX_CONCURRENT_MD5_WORKERS;
      const jobs = Array.from({ length: cap + 1 }, (_, i) =>
        manager.calculateMD5(`${i}`, new Blob())
      );
      expect(FakeWorker.all).toHaveLength(cap);
      expect(manager["waiting"]).toHaveLength(1);

      FakeWorker.all[0].complete();
      await jobs[0];
      expect(FakeWorker.all).toHaveLength(cap + 1);
      expect(manager["waiting"]).toHaveLength(0);

      FakeWorker.all.slice(1).forEach((w) => w.complete());
      await Promise.all(jobs);
      expect(manager["workers"]).toHaveLength(0);
    });
  });

  describe("terminateWorkers", () => {
    it("should terminate all workers", () => {
      manager.terminateWorkers();

      // Simulate adding workers and spy on terminate
      const createdWorkers: Worker[] = [];
      for (let i = 0; i < 5; i++) {
        const w = new Worker(new URL("../MD5Worker.js", import.meta.url), {
          type: "module",
        });
        vi.spyOn(w, "terminate");
        createdWorkers.push(w);
        manager["workers"].push(w);
      }

      expect(manager["workers"]).toHaveLength(5);
      manager.terminateWorkers();

      // Verify terminate called on all created workers
      for (const w of createdWorkers) {
        expect(w.terminate).toHaveBeenCalled();
      }
      expect(manager["workers"]).toHaveLength(0);
    });
  });
});
