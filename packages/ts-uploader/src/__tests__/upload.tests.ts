import { expect } from "@jest/globals";
import { SinglePartUpload } from "../state/SinglePartUpload";
import { MultipartUpload } from "../state/MultipartUpload";
import { ApiConfig } from "../client/config";
import { UploadProgress, UploadStatus, UploadError } from "../state/types";

describe("Upload Tests", () => {
  const apiConfig: ApiConfig = {
    domain: process.env.TS_API_DOMAIN!,
    authorization: process.env.TS_API_AUTHORIZATION!,
  };

  const createTestFile = (size: number) => {
    const blob = new Blob([new ArrayBuffer(size)], {
      type: "application/octet-stream",
    });
    return new File([blob], "test.bin");
  };

  describe("SinglePartUpload", () => {
    it("should upload a small file successfully", async () => {
      const file = createTestFile(1024 * 1024); // 1MB
      const upload = new SinglePartUpload({ api: apiConfig, file });

      const progressEvents: UploadProgress[] = [];
      const statusEvents: UploadStatus[] = [];
      const errorEvents: UploadError[] = [];

      upload.onProgress.addListener((progress: UploadProgress) => {
        progressEvents.push(progress);
      });
      upload.onStatusChange.addListener((status: UploadStatus) => {
        statusEvents.push(status);
      });
      upload.onError.addListener((error: UploadError) => {
        errorEvents.push(error);
      });

      await upload.start();

      expect(statusEvents).toContain("running");
      expect(statusEvents).toContain("complete");
      expect(errorEvents).toHaveLength(0);
      expect(progressEvents[progressEvents.length - 1].complete).toBe(
        file.size
      );
    });

    it("should handle pause and resume", async () => {
      const file = createTestFile(1024 * 1024 * 5); // 5MB
      const upload = new SinglePartUpload({ api: apiConfig, file });

      const statusEvents: UploadStatus[] = [];
      upload.onStatusChange.addListener((status: UploadStatus) => {
        statusEvents.push(status);
      });

      await upload.start();
      await upload.pause();
      await upload.resume();

      expect(statusEvents).toContain("running");
      expect(statusEvents).toContain("paused");
      expect(statusEvents).toContain("complete");
    });

    it("should handle abort", async () => {
      const file = createTestFile(1024 * 1024 * 5);
      const upload = new SinglePartUpload({ api: apiConfig, file });

      const statusEvents: UploadStatus[] = [];
      upload.onStatusChange.addListener((status: UploadStatus) => {
        statusEvents.push(status);
      });

      await upload.start();
      await upload.abort();

      expect(statusEvents).toContain("running");
      expect(statusEvents).toContain("aborted");
    });

    it("should handle retry on failure", async () => {
      const file = createTestFile(1024 * 1024);
      const upload = new SinglePartUpload({
        api: { ...apiConfig, domain: "invalid-domain" },
        file,
      });

      const errorEvents: UploadError[] = [];
      upload.onError.addListener((error: UploadError) => {
        errorEvents.push(error);
      });

      try {
        await upload.start();
      } catch (e) {
        // Expected to fail
      }

      expect(errorEvents).toHaveLength(1);
      expect(errorEvents[0].retryable).toBe(true);

      // Retry with correct domain
      upload.retry();
      await upload.start();
    });
  });

  describe("MultipartUpload", () => {
    it("should upload a large file successfully", async () => {
      const file = createTestFile(1024 * 1024 * 51); // 51MB to trigger multipart
      const upload = new MultipartUpload({ api: apiConfig, file });

      const progressEvents: UploadProgress[] = [];
      const statusEvents: UploadStatus[] = [];
      const errorEvents: UploadError[] = [];

      upload.onProgress.addListener((progress: UploadProgress) => {
        progressEvents.push(progress);
      });
      upload.onStatusChange.addListener((status: UploadStatus) => {
        statusEvents.push(status);
      });
      upload.onError.addListener((error: UploadError) => {
        errorEvents.push(error);
      });

      await upload.start();

      expect(statusEvents).toContain("running");
      expect(statusEvents).toContain("complete");
      expect(errorEvents).toHaveLength(0);
      expect(progressEvents[progressEvents.length - 1].complete).toBe(
        file.size
      );
    });

    it("should handle pause and resume for multipart upload", async () => {
      const file = createTestFile(1024 * 1024 * 51);
      const upload = new MultipartUpload({ api: apiConfig, file });

      const statusEvents: UploadStatus[] = [];
      upload.onStatusChange.addListener((status: UploadStatus) => {
        statusEvents.push(status);
      });

      await upload.start();
      await upload.pause();
      await upload.resume();

      expect(statusEvents).toContain("running");
      expect(statusEvents).toContain("paused");
      expect(statusEvents).toContain("complete");
    });

    it("should handle concurrent part uploads", async () => {
      const file = createTestFile(1024 * 1024 * 51);
      const upload = new MultipartUpload({
        api: apiConfig,
        file,
        maxConcurrentParts: 2,
      });

      const progressEvents: UploadProgress[] = [];
      upload.onProgress.addListener((progress: UploadProgress) => {
        progressEvents.push(progress);
      });

      await upload.start();

      // Check that progress updates are coming from multiple parts
      const uniqueProgressValues = new Set(
        progressEvents.map((e) => e.complete)
      );
      expect(uniqueProgressValues.size).toBeGreaterThan(1);
    });

    it("should handle bandwidth limiting", async () => {
      const file = createTestFile(1024 * 1024 * 51);
      const upload = new MultipartUpload({
        api: apiConfig,
        file,
        bandwidthLimit: 1024 * 1024, // 1MB/s
      });

      const progressEvents: UploadProgress[] = [];
      upload.onProgress.addListener((progress: UploadProgress) => {
        progressEvents.push(progress);
      });

      await upload.start();

      // Check that upload speed is being limited
      const speeds = progressEvents.map((e) => e.metrics.bytesPerSecond);
      const maxSpeed = Math.max(...speeds);
      expect(maxSpeed).toBeLessThanOrEqual(1024 * 1024);
    });
  });
});
