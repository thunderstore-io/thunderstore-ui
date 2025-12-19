import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DapperTs } from "@thunderstore/dapper-ts";

import type { Community } from "../../../../../packages/thunderstore-api/src";
import * as publicEnvVariables from "../../security/publicEnvVariables";
import {
  getClientDapper,
  getDapperForRequest,
  initializeClientDapper,
  resetDapperSingletonForTest,
} from "../dapperSingleton";
import { deduplicatePromiseForRequest } from "../requestCache";

// Mock getSessionTools
vi.mock("../../security/publicEnvVariables", () => ({
  getSessionTools: vi.fn().mockReturnValue({
    getConfig: vi.fn().mockReturnValue({
      apiHost: "http://localhost",
      sessionId: "test-session",
    }),
  }),
}));

describe("dapperSingleton", () => {
  beforeEach(() => {
    // Reset window.Dapper
    if (typeof window !== "undefined") {
      // @ts-expect-error Dapper is not optional on Window
      delete window.Dapper;
    }
    resetDapperSingletonForTest();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("initializeClientDapper", () => {
    it("initializes window.Dapper if it does not exist", () => {
      initializeClientDapper();
      expect(window.Dapper).toBeDefined();
      expect(window.Dapper).toBeInstanceOf(DapperTs);
    });

    it("uses provided factory if supplied", () => {
      const factory = vi.fn().mockReturnValue({ apiHost: "custom" });
      initializeClientDapper(factory);
      expect(window.Dapper).toBeDefined();
      expect(window.Dapper.config()).toEqual({ apiHost: "custom" });
      expect(factory).toHaveBeenCalled();
    });

    it("updates existing window.Dapper config if called again with factory", () => {
      // First initialization
      initializeClientDapper();
      const originalDapper = window.Dapper;
      expect(originalDapper).toBeDefined();

      // Second initialization with new factory
      const newFactory = vi.fn().mockReturnValue({ apiHost: "updated" });
      initializeClientDapper(newFactory);

      expect(window.Dapper).toBe(originalDapper); // Should be same instance
      expect(window.Dapper.config()).toEqual({ apiHost: "updated" });
    });

    it("resolves config factory from session tools if no factory provided", () => {
      initializeClientDapper();
      expect(publicEnvVariables.getSessionTools).toHaveBeenCalled();
    });
  });

  describe("getClientDapper", () => {
    it("returns window.Dapper if it exists", () => {
      initializeClientDapper();
      const dapper = window.Dapper;
      expect(getClientDapper()).toBe(dapper);
    });

    it("initializes and returns window.Dapper if it does not exist", () => {
      expect(window.Dapper).toBeUndefined();
      const dapper = getClientDapper();
      expect(dapper).toBeDefined();
      expect(window.Dapper).toBe(dapper);
    });
  });

  describe("getDapperForRequest", () => {
    it("returns client dapper if no request is provided", () => {
      initializeClientDapper();
      const dapper = getDapperForRequest();
      expect(dapper).toBe(window.Dapper);
    });

    it("returns a proxy if request is provided", () => {
      initializeClientDapper();
      const request = new Request("http://localhost");
      const dapper = getDapperForRequest(request);
      expect(dapper).not.toBe(window.Dapper);
      // It should be a proxy
      expect(dapper).toBeInstanceOf(DapperTs);
    });

    it("caches the proxy for the same request", () => {
      initializeClientDapper();
      const request = new Request("http://localhost");
      const dapper1 = getDapperForRequest(request);
      const dapper2 = getDapperForRequest(request);
      expect(dapper1).toBe(dapper2);
    });

    it("creates different proxies for different requests", () => {
      initializeClientDapper();
      const request1 = new Request("http://localhost");
      const request2 = new Request("http://localhost");
      const dapper1 = getDapperForRequest(request1);
      const dapper2 = getDapperForRequest(request2);
      expect(dapper1).not.toBe(dapper2);
    });

    it("intercepts 'get' methods and caches promises", async () => {
      initializeClientDapper();
      const request = new Request("http://localhost");
      const dapper = getDapperForRequest(request);

      // Mock the underlying method on window.Dapper
      const mockGetCommunities = vi
        .spyOn(window.Dapper, "getCommunities")
        .mockResolvedValue({ count: 0, results: [], hasMore: false });

      const result1 = await dapper.getCommunities();
      const result2 = await dapper.getCommunities();

      expect(result1).toEqual({ count: 0, results: [], hasMore: false });
      expect(result2).toEqual({ count: 0, results: [], hasMore: false });

      // Should be called only once due to caching
      expect(mockGetCommunities).toHaveBeenCalledTimes(1);
    });

    it("does not intercept non-'get' methods", async () => {
      initializeClientDapper();
      const request = new Request("http://localhost");
      const dapper = getDapperForRequest(request);

      // Mock a non-get method
      // postTeamCreate is a good candidate
      const mockPostTeamCreate = vi
        .spyOn(window.Dapper, "postTeamCreate")
        .mockResolvedValue({
          identifier: 1,
          name: "test",
          donation_link: null,
        });

      await dapper.postTeamCreate("test");
      await dapper.postTeamCreate("test");

      // Should be called twice (no caching)
      expect(mockPostTeamCreate).toHaveBeenCalledTimes(2);
    });

    it("shares cache between proxy calls and manual deduplicatePromiseForRequest calls", async () => {
      initializeClientDapper();
      const request = new Request("http://localhost");
      const dapper = getDapperForRequest(request);

      // Mock the underlying method on window.Dapper
      const mockGetCommunity = vi
        .spyOn(window.Dapper, "getCommunity")
        .mockResolvedValue({
          identifier: "1",
          name: "Test Community",
        } as Community);

      // 1. Call via proxy
      const dapperResult = await dapper.getCommunity("1");

      // 2. Call manually with same key and args
      const manualFunc = vi.fn().mockResolvedValue("manual result");
      const manualResult = await deduplicatePromiseForRequest(
        "getCommunity",
        manualFunc,
        ["1"],
        request
      );

      // Assertions
      expect(dapperResult).toEqual({ identifier: "1", name: "Test Community" });
      // Should return the cached result from the first call, NOT "manual result"
      expect(manualResult).toBe(dapperResult);
      // The manual function should NOT have been called
      expect(manualFunc).not.toHaveBeenCalled();
      // The underlying dapper method should have been called once
      expect(mockGetCommunity).toHaveBeenCalledTimes(1);
    });
  });

  describe("resetDapperSingletonForTest", () => {
    it("clears request-scoped proxy cache and config factory", () => {
      initializeClientDapper();
      const request = new Request("http://localhost");

      const proxy1 = getDapperForRequest(request);
      // Ensure factory was resolved once
      expect(publicEnvVariables.getSessionTools).toHaveBeenCalled();

      resetDapperSingletonForTest();

      // After reset, same request should produce a new proxy
      const proxy2 = getDapperForRequest(request);
      expect(proxy2).not.toBe(proxy1);

      // And config factory should be re-resolved
      initializeClientDapper();
      expect(publicEnvVariables.getSessionTools).toHaveBeenCalled();
    });
  });
});
