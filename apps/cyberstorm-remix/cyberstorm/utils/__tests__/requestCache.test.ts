import { describe, it, expect, vi } from "vitest";
import { getCachedRequestPromise } from "../requestCache";

describe("requestCache", () => {
  it("caches result per request", async () => {
    const mockFn = vi.fn().mockResolvedValue("result");
    const request = new Request("http://localhost");

    const result1 = await getCachedRequestPromise(
      "mockFn",
      mockFn,
      ["arg1"],
      request
    );
    const result2 = await getCachedRequestPromise(
      "mockFn",
      mockFn,
      ["arg1"],
      request
    );

    expect(result1).toBe("result");
    expect(result2).toBe("result");
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("does not share cache between requests", async () => {
    const mockFn = vi.fn().mockResolvedValue("result");
    const request1 = new Request("http://localhost");
    const request2 = new Request("http://localhost");

    await getCachedRequestPromise("mockFn", mockFn, ["arg1"], request1);
    await getCachedRequestPromise("mockFn", mockFn, ["arg1"], request2);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("throws error for restricted function names", () => {
    const mockFn = async () => "result";
    const request = new Request("http://localhost");

    expect(() =>
      getCachedRequestPromise("default", mockFn, [], request)
    ).toThrow("Must be named functions to support caching.");
  });

  it("allows caching if a valid name is provided", async () => {
    const mockFn = async () => "result";
    const request = new Request("http://localhost");

    const result = await getCachedRequestPromise(
      "customLabel",
      mockFn,
      [],
      request
    );
    expect(result).toBe("result");
  });

  it("clears request cache on abort", async () => {
    const mockFn = vi.fn().mockResolvedValue("result");
    const controller = new AbortController();
    const request = new Request("http://localhost", {
      signal: controller.signal,
    });

    await getCachedRequestPromise("mockFn", mockFn, ["arg1"], request);

    // Abort the request
    controller.abort();

    await getCachedRequestPromise("mockFn", mockFn, ["arg1"], request);

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

    // First use: populates cache (unavoidable currently as we push after check)
    await getCachedRequestPromise("mockFn", mockFn, ["arg1"], request);
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Second use: should be cleared/ignored and re-executed?
    // Currently it returns cached value because listener wasn't attached.
    await getCachedRequestPromise("mockFn", mockFn, ["arg1"], request);

    // If consistent with above, it should be 2.
    // If inconsistent (bug), it is 1.
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});
