import { describe, expect, it, vi } from "vitest";

import { deduplicatePromiseForRequest } from "../requestCache";

describe("requestCache", () => {
  it("caches result per request", async () => {
    const mockFn = vi.fn().mockResolvedValue("result");
    const request = new Request("http://localhost");

    const result1 = await deduplicatePromiseForRequest(
      "mockFn",
      mockFn,
      ["arg1"],
      request
    );
    const result2 = await deduplicatePromiseForRequest(
      "mockFn",
      mockFn,
      ["arg1"],
      request
    );

    expect(result1).toBe("result");
    expect(result2).toBe("result");
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("returns the exact same promise instance", async () => {
    const mockFn = vi.fn().mockResolvedValue("result");
    const request = new Request("http://localhost");

    const promise1 = deduplicatePromiseForRequest(
      "mockFn",
      mockFn,
      ["arg1"],
      request
    );
    const promise2 = deduplicatePromiseForRequest(
      "mockFn",
      mockFn,
      ["arg1"],
      request
    );

    expect(promise1).toBe(promise2);
  });

  it("distinguishes between calls with different arguments", async () => {
    const mockFn = vi.fn().mockImplementation(async (arg) => arg);
    const request = new Request("http://localhost");

    const result1 = await deduplicatePromiseForRequest(
      "mockFn",
      mockFn,
      ["arg1"],
      request
    );
    const result2 = await deduplicatePromiseForRequest(
      "mockFn",
      mockFn,
      ["arg2"],
      request
    );

    expect(result1).toBe("arg1");
    expect(result2).toBe("arg2");
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("removes rejected promises from cache", async () => {
    const mockFn = vi
      .fn()
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValueOnce("success");
    const request = new Request("http://localhost");

    // First call fails
    await expect(
      deduplicatePromiseForRequest("mockFn", mockFn, ["arg1"], request)
    ).rejects.toThrow("fail");

    // Second call should retry and succeed
    const result = await deduplicatePromiseForRequest(
      "mockFn",
      mockFn,
      ["arg1"],
      request
    );

    expect(result).toBe("success");
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("does not share cache between requests", async () => {
    const mockFn = vi.fn().mockResolvedValue("result");
    const request1 = new Request("http://localhost");
    const request2 = new Request("http://localhost");

    await deduplicatePromiseForRequest("mockFn", mockFn, ["arg1"], request1);
    await deduplicatePromiseForRequest("mockFn", mockFn, ["arg1"], request2);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("clears request cache on abort", async () => {
    const mockFn = vi.fn().mockResolvedValue("result");
    const controller = new AbortController();
    const request = new Request("http://localhost", {
      signal: controller.signal,
    });

    await deduplicatePromiseForRequest("mockFn", mockFn, ["arg1"], request);

    // Abort the request
    controller.abort();

    await deduplicatePromiseForRequest("mockFn", mockFn, ["arg1"], request);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("should behave consistently if request is aborted BEFORE first use", async () => {
    const mockFn = vi.fn().mockResolvedValue("result");
    const controller = new AbortController();
    const request = new Request("http://localhost", {
      signal: controller.signal,
    });

    // Abort before first use
    controller.abort();

    // First use: should NOT cache (or cache is cleared immediately)
    await deduplicatePromiseForRequest("mockFn", mockFn, ["arg1"], request);
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Second use: should be re-executed because cache was not persisted/cleared
    await deduplicatePromiseForRequest("mockFn", mockFn, ["arg1"], request);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("removes from cache after timeout", async () => {
    vi.useFakeTimers();
    const mockFn = vi.fn().mockResolvedValue("result");
    const request = new Request("http://localhost");

    const promise = deduplicatePromiseForRequest(
      "mockFn",
      mockFn,
      ["arg1"],
      request
    );

    // Advance time by 60 seconds + 1ms
    vi.advanceTimersByTime(60001);

    // The next call should create a new promise because the old one expired
    const promise2 = deduplicatePromiseForRequest(
      "mockFn",
      mockFn,
      ["arg1"],
      request
    );

    expect(promise).not.toBe(promise2);
    expect(mockFn).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });
});
