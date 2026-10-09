import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DapperTs } from "@thunderstore/dapper-ts";
import { ApiError } from "@thunderstore/thunderstore-api";

import { makeTeamSettingsTabLoader } from "../dapperClientLoaders";

vi.mock("cyberstorm/security/publicEnvVariables", () => ({
  getPublicEnvVariables: vi.fn().mockReturnValue({}),
  getSessionTools: vi.fn().mockReturnValue({
    getConfig: vi.fn().mockReturnValue({
      apiHost: "http://api.example.invalid",
      sessionId: "sid",
    }),
    clearInvalidSession: vi.fn(),
    getSessionCurrentUser: vi.fn().mockResolvedValue({
      username: "testuser",
      teams_full: [{ name: "MyTeam", role: "owner" }],
    }),
  }),
}));

vi.mock("@thunderstore/dapper-ts", () => ({
  DapperTs: vi.fn().mockImplementation((configFactory, removeSessionHook) => {
    return {
      __configFactory: configFactory,
      __removeSessionHook: removeSessionHook,
      getCurrentUser: vi.fn(),
    };
  }),
}));

describe("dapperClientLoaders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Each tab has its own URL, so its title says which tab it is; these routes
  // have no server loader, so this is the only place that can come from.
  it("names the tab in the title", async () => {
    const loader = makeTeamSettingsTabLoader(
      "Service accounts",
      vi.fn().mockResolvedValue({})
    );

    const result = (await loader({
      params: { namespaceId: "MyTeam" },
      request: new Request("http://example.invalid"),
      context: {},
    } as never)) as { seo: { descriptors: { title?: string }[] } };

    expect(result.seo.descriptors).toContainEqual({
      title: "Service accounts · Team settings for MyTeam · Thunderstore",
    });
  });

  it("calls dataFetcher with dapper and teamName and merges return value", async () => {
    const dataFetcher = vi.fn().mockResolvedValue({ foo: 123 });
    const loader = makeTeamSettingsTabLoader("Members", dataFetcher);

    const result = await loader({
      params: { namespaceId: "MyTeam" },
      request: new Request("http://example.invalid"),
      context: {},
    } as never);

    expect(result).toMatchObject({ teamName: "MyTeam", foo: 123 });
    expect(dataFetcher).toHaveBeenCalledTimes(1);
    expect(dataFetcher.mock.calls[0][1]).toBe("MyTeam");
    expect(DapperTs).toHaveBeenCalledTimes(1);

    const dapperArg = dataFetcher.mock.calls[0][0] as unknown as {
      __configFactory: () => unknown;
      __removeSessionHook: () => void;
    };
    expect(dapperArg.__configFactory()).toEqual({
      apiHost: "http://api.example.invalid",
      sessionId: "sid",
    });

    const tools = (getSessionTools as unknown as ReturnType<typeof vi.fn>).mock
      .results[0].value;
    dapperArg.__removeSessionHook();
    expect(tools.clearInvalidSession).toHaveBeenCalledTimes(1);
  });

  it("translates ApiError with detail into a Response", async () => {
    const dataFetcher = vi.fn().mockImplementation(() => {
      throw new ApiError({
        message: "403: Forbidden",
        response: {
          headers: {},
          status: 403,
          statusText: "Forbidden",
          url: "",
        },
        responseJson: { detail: "Nope" },
      });
    });

    const loader = makeTeamSettingsTabLoader("Members", dataFetcher);

    let thrown: unknown;
    try {
      await loader({
        params: { namespaceId: "MyTeam" },
        request: new Request("http://example.invalid"),
        context: {},
      } as never);
    } catch (e) {
      thrown = e;
    }

    expect(thrown).toBeInstanceOf(Response);
    const res = thrown as Response;
    expect(res.status).toBe(403);
    expect(await res.text()).toBe("Nope");
  });

  it("uses response statusText when ApiError has no detail", async () => {
    const dataFetcher = vi.fn().mockImplementation(() => {
      throw new ApiError({
        message: "404: Not Found",
        response: {
          headers: {},
          status: 404,
          statusText: "Not Found",
          url: "",
        },
      });
    });

    const loader = makeTeamSettingsTabLoader("Members", dataFetcher);

    try {
      await loader({
        params: { namespaceId: "MyTeam" },
        request: new Request("http://example.invalid"),
        context: {},
      } as never);
    } catch (e) {
      const res = e as Response;
      expect(res).toBeInstanceOf(Response);
      expect(res.status).toBe(404);
      expect(await res.text()).toBe("Not Found");
    }
  });
});
