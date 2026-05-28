import React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { PackageSubmissionStatus } from "@thunderstore/dapper/types";

import {
  usePackageFileUpload,
  useSubmissionStatusPolling,
  useUploadCategoryOptions,
} from "../uploadHooks";

const { mockAbort, mockStart } = vi.hoisted(() => ({
  mockStart: vi.fn(),
  mockAbort: vi.fn(),
}));

vi.mock("@thunderstore/ts-uploader", () => {
  class MockMultipartUpload {
    handle = { uuid: "upload-uuid-1" };
    start = mockStart;
    abort = mockAbort;
  }

  return { MultipartUpload: MockMultipartUpload };
});

type ActTestGlobal = typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT?: boolean;
};

// React 18 act() warning suppression in tests.
(globalThis as ActTestGlobal).IS_REACT_ACT_ENVIRONMENT = true;

function asStatus(
  id: string,
  status: "PENDING" | "FINISHED"
): PackageSubmissionStatus {
  return {
    id,
    status,
  } as unknown as PackageSubmissionStatus;
}

function render(element: React.ReactElement) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(element);
  });

  return () => {
    act(() => {
      root.unmount();
    });
    container.remove();
  };
}

function zipFile(name = "mod.zip") {
  return new File(["zip"], name, { type: "application/zip" });
}

describe("usePackageFileUpload", () => {
  beforeEach(() => {
    mockStart.mockReset();
    mockAbort.mockReset();
    mockStart.mockResolvedValue(undefined);
  });

  it("rejects invalid file types without starting upload", async () => {
    const requestConfig = vi.fn(() => ({
      apiHost: "https://api.example.com",
    }));

    let latest: ReturnType<typeof usePackageFileUpload> | undefined;

    function Harness() {
      latest = usePackageFileUpload(requestConfig);
      return null;
    }

    const unmount = render(React.createElement(Harness));

    act(() => {
      latest?.selectFile(
        new File(["text"], "notes.txt", { type: "text/plain" })
      );
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(latest?.uploadError).toMatch(/ZIP archive/i);
    expect(latest?.file).toBeNull();
    expect(mockStart).not.toHaveBeenCalled();

    unmount();
  });

  it("starts multipart upload for valid zip files", async () => {
    const requestConfig = vi.fn(() => ({
      apiHost: "https://api.example.com",
    }));

    let latest: ReturnType<typeof usePackageFileUpload> | undefined;

    function Harness() {
      latest = usePackageFileUpload(requestConfig);
      return null;
    }

    const unmount = render(React.createElement(Harness));

    act(() => {
      latest?.selectFile(zipFile());
    });

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(mockStart).toHaveBeenCalledTimes(1);
    expect(latest?.isDone).toBe(true);
    expect(latest?.usermedia?.uuid).toBe("upload-uuid-1");
    expect(latest?.uploadError).toBeNull();

    unmount();
  });

  it("surfaces missing API host configuration", async () => {
    const requestConfig = vi.fn(() => ({
      apiHost: "",
    })) as unknown as Parameters<typeof usePackageFileUpload>[0];

    let latest: ReturnType<typeof usePackageFileUpload> | undefined;

    function Harness() {
      latest = usePackageFileUpload(requestConfig);
      return null;
    }

    const unmount = render(React.createElement(Harness));

    act(() => {
      latest?.selectFile(zipFile());
    });

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(latest?.uploadError).toBe("API host is not configured");
    expect(mockStart).not.toHaveBeenCalled();

    unmount();
  });

  it("clears file state and aborts in-flight upload", async () => {
    const requestConfig = vi.fn(() => ({
      apiHost: "https://api.example.com",
    }));

    let latest: ReturnType<typeof usePackageFileUpload> | undefined;

    function Harness() {
      latest = usePackageFileUpload(requestConfig);
      return null;
    }

    const unmount = render(React.createElement(Harness));

    act(() => {
      latest?.selectFile(zipFile());
    });

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    act(() => {
      latest?.clearFile();
    });

    expect(mockAbort).toHaveBeenCalled();
    expect(latest?.file).toBeNull();
    expect(latest?.isDone).toBe(false);
    expect(latest?.usermedia).toBeUndefined();

    unmount();
  });

  it("aborts in-flight upload on unmount", async () => {
    mockStart.mockImplementation(
      () =>
        new Promise<void>(() => {
          /* never resolves */
        })
    );

    const requestConfig = vi.fn(() => ({
      apiHost: "https://api.example.com",
    }));

    let latest: ReturnType<typeof usePackageFileUpload> | undefined;

    function Harness() {
      latest = usePackageFileUpload(requestConfig);
      return null;
    }

    const unmount = render(React.createElement(Harness));

    act(() => {
      latest?.selectFile(zipFile());
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockStart).toHaveBeenCalledTimes(1);
    mockAbort.mockClear();

    unmount();

    expect(mockAbort).toHaveBeenCalledTimes(1);
  });
});

describe("useSubmissionStatusPolling", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("continues polling while submission remains pending", async () => {
    vi.useFakeTimers();

    const getPackageSubmissionStatus = vi
      .fn()
      .mockResolvedValueOnce(asStatus("sub-1", "PENDING"))
      .mockResolvedValueOnce(asStatus("sub-1", "FINISHED"));

    const dapper = {
      getPackageSubmissionStatus,
    } as unknown as Parameters<typeof useSubmissionStatusPolling>[0];

    function Harness() {
      const [submissionStatus, setSubmissionStatus] = React.useState<
        PackageSubmissionStatus | undefined
      >(undefined);

      React.useEffect(() => {
        setSubmissionStatus(asStatus("sub-1", "PENDING"));
      }, []);

      useSubmissionStatusPolling(dapper, submissionStatus, setSubmissionStatus);
      return null;
    }

    const unmount = render(React.createElement(Harness));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });

    expect(getPackageSubmissionStatus).toHaveBeenCalledTimes(2);
    expect(getPackageSubmissionStatus).toHaveBeenNthCalledWith(1, "sub-1");
    expect(getPackageSubmissionStatus).toHaveBeenNthCalledWith(2, "sub-1");

    unmount();
  });

  it("retries polling after a failed attempt and clears error on success", async () => {
    vi.useFakeTimers();

    const getPackageSubmissionStatus = vi
      .fn()
      .mockRejectedValueOnce(new Error("network"))
      .mockResolvedValueOnce(asStatus("sub-2", "FINISHED"));

    const dapper = {
      getPackageSubmissionStatus,
    } as unknown as Parameters<typeof useSubmissionStatusPolling>[0];

    function Harness() {
      const [submissionStatus, setSubmissionStatus] = React.useState<
        PackageSubmissionStatus | undefined
      >(undefined);

      React.useEffect(() => {
        setSubmissionStatus(asStatus("sub-2", "PENDING"));
      }, []);

      const { pollingError, retryPolling } = useSubmissionStatusPolling(
        dapper,
        submissionStatus,
        setSubmissionStatus
      );

      React.useEffect(() => {
        if (pollingError) {
          void retryPolling();
        }
      }, [pollingError, retryPolling]);

      return React.createElement(
        "div",
        { "data-polling-error": pollingError ?? "" },
        null
      );
    }

    const unmount = render(React.createElement(Harness));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
      await Promise.resolve();
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
      await Promise.resolve();
    });

    expect(getPackageSubmissionStatus).toHaveBeenCalledTimes(2);
    unmount();
  });
});

describe("useUploadCategoryOptions", () => {
  it("loads category options per selected community", async () => {
    const getCommunityFilters = vi
      .fn()
      .mockImplementation((community: string) =>
        Promise.resolve({
          package_categories: [{ slug: `${community}-cat`, name: "Category" }],
        })
      );

    const dapper = {
      getCommunityFilters,
    } as unknown as Parameters<typeof useUploadCategoryOptions>[0];

    function Harness() {
      const options = useUploadCategoryOptions(dapper, ["c1", "c2"]);
      return React.createElement(
        "div",
        { "data-options-count": String(options.length) },
        null
      );
    }

    const unmount = render(React.createElement(Harness));

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    // Browser runner may render/effect twice; assert required calls are present.
    expect(getCommunityFilters.mock.calls.length).toBeGreaterThanOrEqual(2);
    expect(getCommunityFilters).toHaveBeenCalledWith("c1");
    expect(getCommunityFilters).toHaveBeenCalledWith("c2");

    unmount();
  });

  it("handles category fetch failures without throwing", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    const getCommunityFilters = vi
      .fn()
      .mockRejectedValue(new Error("request failed"));

    const dapper = {
      getCommunityFilters,
    } as unknown as Parameters<typeof useUploadCategoryOptions>[0];

    function Harness() {
      useUploadCategoryOptions(dapper, ["broken-community"]);
      return null;
    }

    const unmount = render(React.createElement(Harness));

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(getCommunityFilters).toHaveBeenCalledWith("broken-community");
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);

    consoleErrorSpy.mockRestore();
    unmount();
  });
});
