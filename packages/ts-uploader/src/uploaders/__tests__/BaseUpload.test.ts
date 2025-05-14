import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MultipartUpload, UploadPart } from "../MultipartUpload";
import { TaskFinishReason, TaskStatus } from "../../tasks/types";
import { startTask, Tasks } from "../../tasks/task";
import { BaseUpload } from "../BaseUpload";
import { UploadConfig } from "../types";

// We have to do this weird half mock, because the XHR mocking is a bit tricky.
class ArbitraryUpload extends BaseUpload {
  async start() {
    this.setStatus("running");
    this.addPart("test1", {
      total: 100,
      complete: 0,
      status: "running",
    });
    this.addPart("test2", {
      total: 100,
      complete: 0,
      status: "running",
    });
    this.updateProgress("test1", {
      total: 100,
      complete: 25,
      status: "running",
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.updateProgress("test2", {
      total: 100,
      complete: 25,
      status: "running",
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("uploadedBytes1", this.progress.metrics.uploadedBytes);
    console.log("partsProgress1", this.progress.partsProgress);
    this.updateProgress("test1", {
      total: 100,
      complete: 50,
      status: "running",
    });
    this.updateProgress("test2", {
      total: 100,
      complete: 50,
      status: "running",
    });
    console.log("uploadedBytes2", this.progress.metrics.uploadedBytes);
    console.log("partsProgress2", this.progress.partsProgress);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.updateProgress("test1", {
      total: 100,
      complete: 75,
      status: "running",
    });
    this.updateProgress("test2", {
      total: 100,
      complete: 75,
      status: "running",
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.updateProgress("test1", {
      total: 100,
      complete: 100,
      status: "complete",
    });
    this.updateProgress("test2", {
      total: 100,
      complete: 100,
      status: "complete",
    });

    this.setStatus("complete");
    return;
  }
  async pause() {
    return;
  }
  async resume() {
    return;
  }
  async abort() {
    return;
  }
  async retry() {
    return;
  }
}

describe("BaseUpload", () => {
  let upload: ArbitraryUpload;

  beforeEach(() => {
    upload = new ArbitraryUpload();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("constructor", () => {
    it("should set the correct config", async () => {
      const config: UploadConfig = {};
      upload = new ArbitraryUpload(config);

      expect(upload["config"]).toEqual({
        maxRetries: 3,
        retryDelay: 1000,
        maxConcurrentUploads: 3,
        checksumAlgorithm: "md5",
        timeout: 30000,
      });
    });

    it("should set the correct config", async () => {
      const config: UploadConfig = {
        maxRetries: 1337,
        retryDelay: 1337,
        maxConcurrentUploads: 1337,
        checksumAlgorithm: "sha256",
        timeout: 1337,
      };
      upload = new ArbitraryUpload(config);

      expect(upload["config"]).toEqual(config);
    });
  });

  describe("progress", () => {
    it("should return the correct progress", async () => {
      await upload.start();

      expect(upload.progress).toEqual({
        total: 200,
        complete: 200,
        status: "complete",
        metrics: {
          bytesPerSecondHistory: [],
          bytesPerSecond: 0,
          totalBytes: 200,
          uploadedBytes: 200,
          startTime: 0,
          lastUpdateTime: 0,
          retryCount: 0,
        },
        error: undefined,
        partsProgress: {
          test1: {
            total: 100,
            complete: 100,
            status: "complete",
          },
          test2: {
            total: 100,
            complete: 100,
            status: "complete",
          },
        },
      });
    });
  });

  // describe("handle", () => {
  //   it("should return the correct handle", async () => {
  //     await upload.initiateUploadAndCreatePartUploadTasks();
  //     expect(upload.handle.uuid).toBe("test-uuid");
  //     expect(upload.handle.datetime_created).toBe("2024-01-01T00:00:00Z");
  //     expect(upload.handle.expiry).toBe("2024-01-02T00:00:00Z");
  //     expect(upload.handle.filename).toBe("test.txt");
  //     expect(upload.handle.status).toBe("not_started");
  //     expect(upload.handle.size).toBe(1000);
  //   });
  // });

  // describe("start", () => {
  //   it("should call all the right functions", async () => {
  //     vi.spyOn(upload, "initiateUploadAndCreatePartUploadTasks");
  //     vi.spyOn(upload, "beginUploadingParts");
  //     vi.spyOn(upload, "finalizeUpload");

  //     await upload.start();

  //     expect(upload.initiateUploadAndCreatePartUploadTasks).toHaveBeenCalled();
  //     expect(upload.beginUploadingParts).toHaveBeenCalled();
  //     expect(upload.finalizeUpload).toHaveBeenCalled();
  //   });

  // it("should setError and return when upload already running", async () => {
  //   upload = new PartialMultipartUploadMock(
  //     {
  //       file: mockFile,
  //     },
  //     mockRequestConfig
  //   );
  //   upload.start();
  //   const secondStart = upload.start();
  //   expect(secondStart).rejects.toThrow();
  //   upload.onStatusChange.addListener((status) => {
  //     expect(status).toBe({
  //       code: "UPLOAD_ALREADY_RUNNING",
  //       message: "Upload already running",
  //       retryable: false,
  //       details: undefined,
  //     });
  //   });
  // });

  // it("should handle upload failure", async () => {
  //   vi.mocked(postUsermediaInitiate).mockRejectedValueOnce(
  //     new Error("Upload failed")
  //   );

  //   await upload.start();

  //   expect(upload.handle.status).toBe("failed");
  //   expect(upload.progress.status).toBe("failed");
  // });

  // it("should not start if already running", async () => {
  //   await upload.start();
  //   const initialStatus = upload.progress.status;

  //   await upload.start();

  //   expect(upload.progress.status).toBe(initialStatus);
  // });
});

// describe("uploadPart", () => {
//   it("should upload a part and update progress", async () => {
//     const part = {
//       payload: new Blob(["test"]),
//       meta: {
//         part_number: 1,
//         url: "http://example.com/upload/1",
//       },
//     };

//     await upload.uploadPart(part);

//     expect(XMLHttpRequest.prototype.open).toHaveBeenCalledWith(
//       "PUT",
//       part.meta.url
//     );
//     expect(XMLHttpRequest.prototype.send).toHaveBeenCalledWith(part.payload);
//   }, 10000);

//   it("should handle upload part failure", async () => {
//     const part = {
//       payload: new Blob(["test"]),
//       meta: {
//         part_number: 1,
//         url: "http://test.com/upload/1",
//       },
//     };

//     class MockXMLHttpRequest extends XMLHttpRequest {
//       onprogress = null;
//       onload = null;
//       status = 500;
//       getResponseHeader = vi.fn();
//       open = vi.fn();
//       send = vi.fn();
//       setRequestHeader = vi.fn();
//     }

//     global.XMLHttpRequest = MockXMLHttpRequest;

//     await upload.uploadPart(part);

//     await expect(upload.uploadPart(part)).rejects.toThrow();
//   });
// });
// });
