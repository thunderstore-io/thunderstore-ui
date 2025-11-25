import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  initializeClientDapper,
  getClientDapper,
  getRequestScopedDapper,
  resetDapperSingletonForTest,
} from "../dapperSingleton";
import { DapperTs } from "@thunderstore/dapper-ts";
import * as publicEnvVariables from "../../security/publicEnvVariables";

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

  describe("getRequestScopedDapper", () => {
    it("returns client dapper if no request is provided", () => {
      initializeClientDapper();
      const dapper = getRequestScopedDapper();
      expect(dapper).toBe(window.Dapper);
    });

    it("returns a proxy if request is provided", () => {
      initializeClientDapper();
      const request = new Request("http://localhost");
      const dapper = getRequestScopedDapper(request);
      expect(dapper).not.toBe(window.Dapper);
      // It should be a proxy
      expect(dapper).toBeInstanceOf(DapperTs);
    });

    it("caches the proxy for the same request", () => {
      initializeClientDapper();
      const request = new Request("http://localhost");
      const dapper1 = getRequestScopedDapper(request);
      const dapper2 = getRequestScopedDapper(request);
      expect(dapper1).toBe(dapper2);
    });

    it("creates different proxies for different requests", () => {
      initializeClientDapper();
      const request1 = new Request("http://localhost");
      const request2 = new Request("http://localhost");
      const dapper1 = getRequestScopedDapper(request1);
      const dapper2 = getRequestScopedDapper(request2);
      expect(dapper1).not.toBe(dapper2);
    });

    it("intercepts 'get' methods and caches promises", async () => {
      initializeClientDapper();
      const request = new Request("http://localhost");
      const dapper = getRequestScopedDapper(request);

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
      const dapper = getRequestScopedDapper(request);

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
  });
});
