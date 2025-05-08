import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MultipartUpload, UploadPart } from "../MultipartUpload";
import { TaskFinishReason, TaskStatus } from "../../tasks/types";
import { startTask, Tasks } from "../../tasks/task";
import { BaseUpload } from "../BaseUpload";

// Mock the MD5WorkerManager
vi.mock("../../workers", () => ({
  getMD5WorkerManager: vi.fn(() => ({
    calculateMD5: vi.fn().mockResolvedValue("mock-md5-hash"),
    initialize: vi.fn(),
    terminateWorkers: vi.fn(),
  })),
}));

// // Mock the API calls
vi.mock("@thunderstore/thunderstore-api", () => ({
  postUsermediaInitiate: vi.fn().mockResolvedValue({
    user_media: {
      uuid: "test-uuid",
      datetime_created: "2024-01-01T00:00:00Z",
      expiry: "2024-01-02T00:00:00Z",
      status: "not_started",
      filename: "test.txt",
      size: 1000,
    },
    upload_urls: [
      { part_number: 1, url: "http://example.com/upload/1" },
      { part_number: 2, url: "http://example.com/upload/2" },
    ],
  }),
  postUsermediaFinish: vi.fn().mockResolvedValue({
    uuid: "test-uuid",
    datetime_created: "2024-01-01T00:00:00Z",
    expiry: "2024-01-02T00:00:00Z",
    status: "complete",
    filename: "test.txt",
    size: 1000,
  }),
  postUsermediaAbort: vi.fn().mockResolvedValue({
    uuid: "test-uuid",
    datetime_created: "2024-01-01T00:00:00Z",
    expiry: "2024-01-02T00:00:00Z",
    status: "aborted",
    filename: "test.txt",
    size: 1000,
  }),
}));

// We have to do this weird half mock, because the XHR mocking is a bit tricky.
class PartialMultipartUploadMock extends MultipartUpload {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async doPartUpload(_part: UploadPart, uniqueId: string, _checksum: string) {
    this["partStates"][uniqueId].state = "running";

    this.updateProgress(uniqueId, {
      total: 100,
      complete: 30,
      status: "running",
    });
    this.updateProgress(uniqueId, {
      total: 100,
      complete: 60,
      status: "running",
    });
    this.updateProgress(uniqueId, {
      total: 100,
      complete: 90,
      status: "running",
    });
    this.updateProgress(uniqueId, {
      total: 100,
      complete: 100,
      status: "running",
    });

    this["partStates"][uniqueId].etag = "mock-etag";
    this["partStates"][uniqueId].state = "complete";
  }
}

describe("MultipartUpload", () => {
  let upload: PartialMultipartUploadMock;
  const mockFile = new File(["test content"], "test.txt", {
    type: "text/plain",
  });

  const mockRequestConfig = () => ({
    apiHost: "localhost",
    sessionId: "test-session-id",
  });

  beforeEach(() => {
    upload = new PartialMultipartUploadMock(
      {
        file: mockFile,
      },
      mockRequestConfig
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("handle", () => {
    it("should return the correct handle", async () => {
      await upload.initiateUploadAndCreatePartUploadTasks();
      expect(upload.handle.uuid).toBe("test-uuid");
      expect(upload.handle.datetime_created).toBe("2024-01-01T00:00:00Z");
      expect(upload.handle.expiry).toBe("2024-01-02T00:00:00Z");
      expect(upload.handle.filename).toBe("test.txt");
      expect(upload.handle.status).toBe("not_started");
      expect(upload.handle.size).toBe(1000);
    });
  });

  describe("start", () => {
    it("should call all the right functions", async () => {
      vi.spyOn(upload, "initiateUploadAndCreatePartUploadTasks");
      vi.spyOn(upload, "beginUploadingParts");
      vi.spyOn(upload, "finalizeUpload");

      await upload.start();

      expect(upload.initiateUploadAndCreatePartUploadTasks).toHaveBeenCalled();
      expect(upload.beginUploadingParts).toHaveBeenCalled();
      expect(upload.finalizeUpload).toHaveBeenCalled();
    });

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
});
