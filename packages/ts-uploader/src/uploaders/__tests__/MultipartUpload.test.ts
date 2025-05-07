import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MultipartUpload, UploadPart } from "../MultipartUpload";
import { TaskFinishReason, TaskStatus } from "../../tasks/types";
import { startTask, Tasks } from "../../tasks/task";

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

  async addPendingTask() {
    const pendingTask = Tasks.create(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async (_uploadPart: UploadPart) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      },
      {
        payload: new Blob(["test"]),
        meta: {
          part_number: 1,
          url: "http://example.com/upload/1",
        },
      }
    );
    this["uploadPartTasks"].push(pendingTask);
    const startedTask = startTask(pendingTask);
    this["uploadPartTasks"].push(startedTask);
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

  describe("createdUploadPartTasks", () => {
    it("should get tasks with PENDING status", async () => {
      await upload.initiateUploadAndCreatePartUploadTasks();
      expect(upload.createdUploadPartTasks.length).toBe(2);
      expect(upload.createdUploadPartTasks[0].status).toBe(TaskStatus.PENDING);
      expect(upload.createdUploadPartTasks[1].status).toBe(TaskStatus.PENDING);
      expect(upload.createdUploadPartTasks[0].args.meta.url).toBe(
        "http://example.com/upload/1"
      );
      expect(upload.createdUploadPartTasks[1].args.meta.url).toBe(
        "http://example.com/upload/2"
      );
    });
  });

  describe("startedUploadPartTasks", () => {
    it("should get tasks with STARTED status", async () => {
      await upload.initiateUploadAndCreatePartUploadTasks();
      await upload.beginUploadingParts();
      expect(upload.startedUploadPartTasks.length).toBe(2);
      expect(upload.startedUploadPartTasks[0].status).toBe(TaskStatus.STARTED);
      expect(upload.startedUploadPartTasks[1].status).toBe(TaskStatus.STARTED);
      expect(upload.startedUploadPartTasks[0].args.meta.url).toBe(
        "http://example.com/upload/1"
      );
      expect(upload.startedUploadPartTasks[1].args.meta.url).toBe(
        "http://example.com/upload/2"
      );
    });
  });

  describe("finishedUploadPartTasks", () => {
    it("should get tasks with FINISHED status", async () => {
      await upload.initiateUploadAndCreatePartUploadTasks();
      await upload.beginUploadingParts();
      expect(upload.finishedUploadPartTasks.length).toBe(2);
      expect(upload.finishedUploadPartTasks[0].status).toBe(
        TaskStatus.FINISHED
      );
      expect(upload.finishedUploadPartTasks[1].status).toBe(
        TaskStatus.FINISHED
      );
      expect(upload.finishedUploadPartTasks[0].args.meta.url).toBe(
        "http://example.com/upload/1"
      );
      expect(upload.finishedUploadPartTasks[1].args.meta.url).toBe(
        "http://example.com/upload/2"
      );
    });
  });

  describe("abortedUploadPartTasks", () => {
    it("should get tasks with FINISHED status and SUCCESS finish reason", async () => {
      // Do regular stuff for testing the postUsermediaAbort call
      await upload.initiateUploadAndCreatePartUploadTasks();
      await upload.beginUploadingParts();
      // Add new task that stays pending for a bit
      upload.addPendingTask();
      // console.log("startedUploadPartTasks", upload.startedUploadPartTasks);
      console.log("upload.uploadPartTasks", upload["uploadPartTasks"]);
      await upload.abort();
      console.log(
        "upload.abortedUploadPartTasks",
        upload.abortedUploadPartTasks
      );
      expect(upload.abortedUploadPartTasks.length).toBe(2);
      expect(upload.abortedUploadPartTasks[0].status).toBe(TaskStatus.FINISHED);
      expect(upload.abortedUploadPartTasks[0].finishReason).toBe(
        TaskFinishReason.ABORTED
      );
      expect(upload.abortedUploadPartTasks[0].args.meta.url).toBe(
        "http://example.com/upload/1"
      );
      expect(upload.abortedUploadPartTasks[1].status).toBe(TaskStatus.FINISHED);
      expect(upload.abortedUploadPartTasks[1].finishReason).toBe(
        TaskFinishReason.ABORTED
      );
      expect(upload.abortedUploadPartTasks[1].args.meta.url).toBe(
        "http://example.com/upload/2"
      );
    });
  });

  describe("erroredUploadPartTasks", () => {
    it("should get tasks with FINISHED status and ERROR finish reason", async () => {
      await upload.initiateUploadAndCreatePartUploadTasks();
      await upload.beginUploadingParts();
      expect(upload.erroredUploadPartTasks.length).toBe(2);
      expect(upload.erroredUploadPartTasks[0].status).toBe(TaskStatus.FINISHED);
      expect(upload.erroredUploadPartTasks[0].finishReason).toBe(
        TaskFinishReason.SUCCESS
      );
      expect(upload.erroredUploadPartTasks[0].args.meta.url).toBe(
        "http://example.com/upload/1"
      );
      expect(upload.erroredUploadPartTasks[1].status).toBe(TaskStatus.FINISHED);
      expect(upload.erroredUploadPartTasks[1].finishReason).toBe(
        TaskFinishReason.SUCCESS
      );
      expect(upload.erroredUploadPartTasks[1].args.meta.url).toBe(
        "http://example.com/upload/2"
      );
    });
  });

  describe("successfulUploadPartTasks", () => {
    it("should get tasks with FINISHED status and SUCCESS finish reason", async () => {
      await upload.initiateUploadAndCreatePartUploadTasks();
      await upload.beginUploadingParts();
      expect(upload.successfulUploadPartTasks.length).toBe(2);
      expect(upload.successfulUploadPartTasks[0].status).toBe(
        TaskStatus.FINISHED
      );
      expect(upload.successfulUploadPartTasks[0].finishReason).toBe(
        TaskFinishReason.SUCCESS
      );
      expect(upload.successfulUploadPartTasks[0].args.meta.url).toBe(
        "http://example.com/upload/1"
      );
      expect(upload.successfulUploadPartTasks[1].status).toBe(
        TaskStatus.FINISHED
      );
      expect(upload.successfulUploadPartTasks[1].finishReason).toBe(
        TaskFinishReason.SUCCESS
      );
      expect(upload.successfulUploadPartTasks[1].args.meta.url).toBe(
        "http://example.com/upload/2"
      );
    });
  });

  // describe("start", () => {
  //   it("should initialize upload and create parts", async () => {
  //     await upload.start();

  //     expect(postUsermediaInitiate).toHaveBeenCalled();
  //     console.log("upload.handle", upload.handle.uuid);
  //     console.log(
  //       "upload.finishedUploadPartTasks",
  //       upload.finishedUploadPartTasks
  //     );
  //     console.log(upload.finishedUploadPartTasks[0].args);
  //     expect(upload.handle.uuid).toBe("test-uuid");
  //     expect(upload.handle.datetime_created).toBe("2024-01-01T00:00:00Z");
  //     expect(upload.handle.expiry).toBe("2024-01-02T00:00:00Z");
  //     expect(upload.handle.filename).toBe("test.txt");
  //     expect(upload.handle.size).toBe(1000);
  //     expect(upload.createdUploadPartTasks.length).toBe(0);
  //     expect(upload.startedUploadPartTasks.length).toBe(0);
  //     expect(upload.finishedUploadPartTasks.length).toBe(2);
  //     expect(upload.erroredUploadPartTasks.length).toBe(0);
  //     expect(upload.abortedUploadPartTasks.length).toBe(0);
  //     expect(upload.successfulUploadPartTasks.length).toBe(2);
  //     expect(postUsermediaFinish).toHaveBeenCalled();
  //     expect(upload.handle.status).toBe("complete");
  //   });

  //   it("should handle upload failure", async () => {
  //     vi.mocked(postUsermediaInitiate).mockRejectedValueOnce(
  //       new Error("Upload failed")
  //     );

  //     await upload.start();

  //     expect(upload.handle.status).toBe("failed");
  //     expect(upload.progress.status).toBe("failed");
  //   });

  //   it("should not start if already running", async () => {
  //     await upload.start();
  //     const initialStatus = upload.progress.status;

  //     await upload.start();

  //     expect(upload.progress.status).toBe(initialStatus);
  //   });
  // });

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
