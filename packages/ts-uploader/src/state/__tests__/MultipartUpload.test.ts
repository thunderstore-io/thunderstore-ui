import { describe, it, expect, beforeEach, vi } from "vitest";
import { MultipartUpload } from "../MultipartUpload";
import { MultiPartUploadOptions, UploadConfig } from "../types";
import { UserMedia, UploadPartUrl } from "../../client/types";
import { MD5WorkerManager } from "../../workers";
import { RequestConfig } from "@thunderstore/thunderstore-api";

// // Mock the API calls
// vi.mock("@thunderstore/thunderstore-api", () => ({
//   postUsermediaInitiate: vi.fn(),
//   postUsermediaFinish: vi.fn(),
//   postUsermediaAbort: vi.fn(),
// }));

// Mock the MD5 worker manager
vi.mock("../../workers", () => {
  const mockMD5WorkerManager = {
    initialize: vi.fn(),
    terminateWorkers: vi.fn(),
    calculateMD5: vi.fn().mockResolvedValue("mock-md5-hash"),
  } as unknown as MD5WorkerManager;

  return {
    getMD5WorkerManager: vi.fn().mockReturnValue(mockMD5WorkerManager),
    MD5WorkerManager: vi.fn().mockImplementation(() => mockMD5WorkerManager),
  };
});

describe("MultipartUpload", () => {
  let upload: MultipartUpload;
  let mockFile: File;
  let mockRequestConfig: () => RequestConfig;
  let mockApi: {
    postUsermediaInitiate: ReturnType<typeof vi.fn>;
    postUsermediaFinish: ReturnType<typeof vi.fn>;
    postUsermediaAbort: ReturnType<typeof vi.fn>;
  };
  let mockMD5WorkerManager: MD5WorkerManager;

  const mockUserMedia: UserMedia = {
    uuid: "test-uuid",
    datetime_created: "2023-01-01T00:00:00Z",
    expiry: "2023-01-02T00:00:00Z",
    status: "pending",
    filename: "test.txt",
    size: 100,
  };

  const mockUploadUrls: UploadPartUrl[] = [
    {
      part_number: 1,
      url: "https://example.com/upload/part1",
      offset: 0,
      length: 50,
    },
    {
      part_number: 2,
      url: "https://example.com/upload/part2",
      offset: 50,
      length: 50,
    },
  ];

  beforeEach(async () => {
    // Create a mock file
    mockFile = new File(["test content"], "test.txt", { type: "text/plain" });

    // Create mock request config
    mockRequestConfig = vi.fn().mockReturnValue({});

    // Get mock instances
    mockApi = await vi.importMock("@thunderstore/thunderstore-api");
    const mockWorkers = (await vi.importMock("../../workers")) as {
      getMD5WorkerManager: () => MD5WorkerManager;
    };
    mockMD5WorkerManager = mockWorkers.getMD5WorkerManager();

    // Setup mock responses
    mockApi.postUsermediaInitiate.mockResolvedValue({
      user_media: mockUserMedia,
      upload_urls: mockUploadUrls,
    });

    mockApi.postUsermediaFinish.mockResolvedValue({
      ...mockUserMedia,
      status: "complete",
    });

    mockApi.postUsermediaAbort.mockResolvedValue({});

    // Create upload instance
    const options: MultiPartUploadOptions = {
      file: mockFile,
      maxConcurrentParts: 2,
    };

    const config: UploadConfig = {
      maxRetries: 3,
      retryDelay: 1000,
      maxConcurrentParts: 2,
      checksumAlgorithm: "md5",
      timeout: 30000,
    };

    upload = new MultipartUpload(options, mockRequestConfig, config);
  });

  describe("start", () => {
    it("should initialize upload and start uploading parts", async () => {
      // Mock XMLHttpRequest for part uploads
      const mockXHR = {
        open: vi.fn(),
        setRequestHeader: vi.fn(),
        send: vi.fn(),
        status: 200,
        getResponseHeader: vi.fn().mockReturnValue("mock-etag"),
        upload: {
          onprogress: null,
        },
        onload: null,
        onerror: null,
      };

      global.XMLHttpRequest = vi
        .fn()
        .mockImplementation(() => mockXHR) as unknown as typeof XMLHttpRequest;

      await upload.start();

      // Verify API calls
      expect(mockApi.postUsermediaInitiate).toHaveBeenCalled();
      expect(mockApi.postUsermediaFinish).toHaveBeenCalled();

      // Verify MD5 calculation
      expect(mockMD5WorkerManager.calculateMD5).toHaveBeenCalled();

      // Verify upload status
      expect(upload["status"]).toBe("complete");
    });
  });

  describe("pause", () => {
    it("should pause the upload", async () => {
      // Start the upload first
      await upload.start();
      expect(upload["status"]).toBe("complete");

      // Then pause it
      await upload.pause();
      expect(upload["status"]).toBe("paused");
    });
  });

  describe("resume", () => {
    it("should resume the upload", async () => {
      // Start and pause the upload first
      await upload.start();
      await upload.pause();
      expect(upload["status"]).toBe("paused");

      // Then resume it
      await upload.resume();
      expect(upload["status"]).toBe("running");
    });
  });

  describe("abort", () => {
    it("should abort the upload and call API", async () => {
      // Start the upload first
      await upload.start();
      expect(upload["status"]).toBe("complete");

      // Then abort it
      await upload.abort();
      expect(mockApi.postUsermediaAbort).toHaveBeenCalled();
      expect(upload["status"]).toBe("aborted");
    });
  });

  describe("retry", () => {
    it("should retry the upload", async () => {
      // Start and fail the upload first
      await upload.start();
      upload["setError"]({
        code: "TEST_ERROR",
        message: "Test error",
        retryable: true,
      });
      expect(upload["status"]).toBe("failed");

      // Then retry it
      await upload.retry();
      expect(upload["status"]).toBe("running");
    });
  });

  describe("uploadPart", () => {
    it("should upload a part successfully", async () => {
      const mockPart = {
        payload: new Blob(["test content"]),
        meta: {
          part_number: 1,
          url: "test-url",
        },
      };

      const mockXHR = {
        open: vi.fn(),
        setRequestHeader: vi.fn(),
        send: vi.fn(),
        status: 200,
        getResponseHeader: vi.fn().mockReturnValue("mock-etag"),
        upload: {
          onprogress: null,
        },
        onload: null,
        onerror: null,
      };

      global.XMLHttpRequest = vi
        .fn()
        .mockImplementation(() => mockXHR) as unknown as typeof XMLHttpRequest;

      // Set up the part state
      upload["partStates"] = {
        "test-uuid-1": {
          part: mockPart,
          uniqueId: "test-uuid-1",
          state: "prepared",
          etag: undefined,
          error: undefined,
          checksum: undefined,
        },
      };

      await upload["uploadPart"]("test-uuid-1", mockPart, mockMD5WorkerManager);

      expect(mockXHR.open).toHaveBeenCalledWith("PUT", "test-url");
      expect(mockXHR.send).toHaveBeenCalled();
      expect(upload["partStates"]["test-uuid-1"].state).toBe("complete");
    });

    it("should handle upload failure", async () => {
      const mockPart = {
        payload: new Blob(["test content"]),
        meta: {
          part_number: 1,
          url: "test-url",
        },
      };

      const mockXHR = {
        open: vi.fn(),
        setRequestHeader: vi.fn(),
        send: vi.fn(),
        status: 500,
        getResponseHeader: vi.fn(),
        upload: {
          onprogress: null,
        },
        onload: null,
        onerror: null,
      };

      global.XMLHttpRequest = vi
        .fn()
        .mockImplementation(() => mockXHR) as unknown as typeof XMLHttpRequest;

      // Set up the part state
      upload["partStates"] = {
        "test-uuid-1": {
          part: mockPart,
          uniqueId: "test-uuid-1",
          state: "prepared",
          etag: undefined,
          error: undefined,
          checksum: undefined,
        },
      };

      await expect(
        upload["uploadPart"]("test-uuid-1", mockPart, mockMD5WorkerManager)
      ).rejects.toBeDefined();
      expect(upload["partStates"]["test-uuid-1"].state).toBe("error");
    });
  });
});
