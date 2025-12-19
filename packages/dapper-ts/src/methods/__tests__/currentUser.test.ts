import { beforeEach, describe, expect, it, vi } from "vitest";

import type { DapperTsInterface } from "../../index";

vi.mock("@thunderstore/thunderstore-api", () => {
  class ApiError extends Error {
    response: Response;
    responseJson?: unknown;

    constructor(args: {
      message: string;
      response: Response;
      responseJson?: unknown;
    }) {
      super(args.message);
      this.name = "ApiError";
      this.response = args.response;
      this.responseJson = args.responseJson;
    }
  }

  return {
    ApiError,
    fetchCurrentUser: vi.fn(),
    fetchCurrentUserTeamPermissions: vi.fn(),
  };
});

import type { Mock } from "vitest";
import {
  ApiError,
  fetchCurrentUser,
  fetchCurrentUserTeamPermissions,
} from "@thunderstore/thunderstore-api";

import { getCurrentUser, getCurrentUserTeamPermissions } from "../currentUser";

describe("dapper-ts currentUser methods", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getCurrentUser returns fetched data", async () => {
    const ctx = {
      config: () => ({ apiHost: "http://api", sessionId: "sid" }),
      removeSessionHook: vi.fn(),
    } satisfies Pick<DapperTsInterface, "config" | "removeSessionHook">;

    const fetchCurrentUserMock = fetchCurrentUser as unknown as Mock;

    fetchCurrentUserMock.mockResolvedValue({ username: "abc" });

    await expect(
      getCurrentUser.call(ctx as unknown as DapperTsInterface)
    ).resolves.toEqual({
      username: "abc",
    });

    expect(fetchCurrentUser).toHaveBeenCalledWith({
      config: ctx.config,
      params: {},
      data: {},
      queryParams: {},
    });
  });

  it("getCurrentUser clears session hook and returns null on 401 ApiError", async () => {
    const removeSessionHook = vi.fn();
    const ctx = {
      config: () => ({ apiHost: "http://api", sessionId: "sid" }),
      removeSessionHook,
    } satisfies Pick<DapperTsInterface, "config" | "removeSessionHook">;

    const fetchCurrentUserMock = fetchCurrentUser as unknown as Mock;

    const response = new Response(null, {
      status: 401,
      statusText: "Unauthorized",
    });
    const err = new ApiError({ message: "401: Unauthorized", response });

    fetchCurrentUserMock.mockRejectedValue(err);

    await expect(
      getCurrentUser.call(ctx as unknown as DapperTsInterface)
    ).resolves.toBeNull();
    expect(removeSessionHook).toHaveBeenCalledTimes(1);
  });

  it("getCurrentUser rethrows non-401 ApiError", async () => {
    const ctx = {
      config: () => ({ apiHost: "http://api", sessionId: "sid" }),
      removeSessionHook: vi.fn(),
    } satisfies Pick<DapperTsInterface, "config" | "removeSessionHook">;

    const fetchCurrentUserMock = fetchCurrentUser as unknown as Mock;

    const response = new Response(null, {
      status: 500,
      statusText: "Server Error",
    });
    const err = new ApiError({ message: "500: Server Error", response });

    fetchCurrentUserMock.mockRejectedValue(err);

    await expect(
      getCurrentUser.call(ctx as unknown as DapperTsInterface)
    ).rejects.toBe(err);
  });

  it("getCurrentUserTeamPermissions forwards team_name param", async () => {
    const ctx = {
      config: () => ({ apiHost: "http://api", sessionId: "sid" }),
      removeSessionHook: vi.fn(),
    } satisfies Pick<DapperTsInterface, "config" | "removeSessionHook">;

    const fetchPermissionsMock =
      fetchCurrentUserTeamPermissions as unknown as Mock;

    fetchPermissionsMock.mockResolvedValue({ ok: true });

    await expect(
      getCurrentUserTeamPermissions.call(
        ctx as unknown as DapperTsInterface,
        "MyTeam"
      )
    ).resolves.toEqual({ ok: true });

    expect(fetchCurrentUserTeamPermissions).toHaveBeenCalledWith({
      config: ctx.config,
      params: { team_name: "MyTeam" },
      data: {},
      queryParams: {},
    });
  });
});
