import { describe, it, expect, beforeEach, vi } from "vitest";
import { BaseUpload } from "../BaseUpload";
import { UploadConfig, UploadError } from "../types";

// Mock implementation for testing
class MockUpload extends BaseUpload {
  async start(): Promise<void> {
    this.setStatus("running");
  }

  async pause(): Promise<void> {
    this.setStatus("paused");
  }

  async resume(): Promise<void> {
    this.setStatus("running");
  }

  async abort(): Promise<void> {
    this.setStatus("aborted");
  }

  async retry(): Promise<void> {
    this.setStatus("running");
  }
}

describe("BaseUpload", () => {
  let upload: MockUpload;
  const defaultConfig: UploadConfig = {
    maxRetries: 3,
    retryDelay: 1000,
    maxConcurrentParts: 3,
    checksumAlgorithm: "md5",
    timeout: 30000,
  };

  beforeEach(() => {
    upload = new MockUpload();
  });

  describe("constructor", () => {
    it("should initialize with default config", () => {
      expect(upload["config"]).toEqual(defaultConfig);
    });

    it("should override default config with provided values", () => {
      const customConfig: UploadConfig = {
        maxRetries: 5,
        retryDelay: 2000,
        maxConcurrentParts: 5,
        checksumAlgorithm: "sha256",
        timeout: 60000,
      };

      const customUpload = new MockUpload(customConfig);
      expect(customUpload["config"]).toEqual(customConfig);
    });
  });

  describe("progress", () => {
    it("should return initial progress state", () => {
      const progress = upload.progress;
      expect(progress).toEqual({
        total: 0,
        complete: 0,
        status: "not_started",
        metrics: {
          bytesPerSecondHistory: [],
          bytesPerSecond: 0,
          totalBytes: 0,
          uploadedBytes: 0,
          startTime: 0,
          lastUpdateTime: 0,
          retryCount: 0,
        },
        partsProgress: {},
      });
    });
  });

  describe("updateProgress", () => {
    it("should update progress and emit event", () => {
      const mockPartProgress = {
        total: 100,
        complete: 50,
        status: "running" as const,
      };

      const progressSpy = vi.fn();
      upload.onProgress.addListener(progressSpy);

      upload["updateProgress"]("part1", mockPartProgress);

      expect(upload["partsProgress"]["part1"]).toEqual(mockPartProgress);
      expect(upload["metrics"].uploadedBytes).toBe(50);
      expect(progressSpy).toHaveBeenCalled();
    });

    it("should calculate bytes per second when time difference is sufficient", () => {
      const mockPartProgress = {
        total: 100,
        complete: 50,
        status: "running" as const,
      };

      // Set initial time
      upload["metrics"].lastUpdateTime = Date.now() - 2000; // 2 seconds ago

      upload["updateProgress"]("part1", mockPartProgress);

      expect(upload["metrics"].bytesPerSecond).toBeGreaterThan(0);
      expect(upload["metrics"].bytesPerSecondHistory).toHaveLength(1);
    });
  });

  describe("setStatus", () => {
    it("should update status and emit event", () => {
      const statusSpy = vi.fn();
      upload.onStatusChange.addListener(statusSpy);

      upload["setStatus"]("running");

      expect(upload["status"]).toBe("running");
      expect(statusSpy).toHaveBeenCalledWith("running");
    });

    it("should not emit event if status hasn't changed", () => {
      const statusSpy = vi.fn();
      upload.onStatusChange.addListener(statusSpy);

      upload["setStatus"]("not_started");
      upload["setStatus"]("not_started");

      expect(statusSpy).not.toHaveBeenCalled();
    });
  });

  describe("setError", () => {
    it("should set error and emit event", () => {
      const errorSpy = vi.fn();
      upload.onError.addListener(errorSpy);

      const mockError: UploadError = {
        code: "TEST_ERROR",
        message: "Test error message",
        retryable: true,
      };

      upload["setError"](mockError);

      expect(upload["error"]).toEqual(mockError);
      expect(errorSpy).toHaveBeenCalledWith(mockError);
    });
  });

  describe("retryWithBackoff", () => {
    it("should retry operation with exponential backoff", async () => {
      const mockOperation = vi
        .fn()
        .mockRejectedValueOnce(new Error("First attempt failed"))
        .mockRejectedValueOnce(new Error("Second attempt failed"))
        .mockResolvedValueOnce("Success");

      const result = await upload["retryWithBackoff"](mockOperation);

      expect(result).toBe("Success");
      expect(mockOperation).toHaveBeenCalledTimes(3);
    });

    it("should stop retrying after max retries", async () => {
      const mockOperation = vi
        .fn()
        .mockRejectedValue(new Error("Always fails"));

      await expect(upload["retryWithBackoff"](mockOperation)).rejects.toThrow(
        "Always fails"
      );
      expect(mockOperation).toHaveBeenCalledTimes(4); // Initial attempt + 3 retries
    }, 10000);
  });

  describe("abstract methods", () => {
    it("should implement start method", async () => {
      await upload.start();
      expect(upload["status"]).toBe("running");
    });

    it("should implement pause method", async () => {
      await upload.pause();
      expect(upload["status"]).toBe("paused");
    });

    it("should implement resume method", async () => {
      await upload.resume();
      expect(upload["status"]).toBe("running");
    });

    it("should implement abort method", async () => {
      await upload.abort();
      expect(upload["status"]).toBe("aborted");
    });

    it("should implement retry method", async () => {
      await upload.retry();
      expect(upload["status"]).toBe("running");
    });
  });
});
