import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { apiFetch } from "../apiFetch";
import { ApiError, isCloudflareChallengeError } from "../errors";

const config = () => ({
  apiHost: "https://api.example.org",
  sessionId: undefined,
});

function stubFetch(response: Response) {
  const fetchMock = vi.fn(async () => response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function fetchListings(responseSchema?: z.ZodSchema) {
  return apiFetch({
    args: { config, path: "api/cyberstorm/listing/riskofrain2/" },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema,
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("apiFetch", () => {
  it("returns parsed data on a JSON success response", async () => {
    stubFetch(
      new Response(JSON.stringify({ name: "riskofrain2" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
    const result = await fetchListings(z.object({ name: z.string() }));
    expect(result).toEqual({ name: "riskofrain2" });
  });

  it("throws an ApiError with response context on a JSON error response", async () => {
    stubFetch(
      new Response(JSON.stringify({ detail: "Not found" }), {
        status: 404,
        statusText: "Not Found",
        headers: { "Content-Type": "application/json" },
      })
    );
    const error = await fetchListings().catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.response.status).toBe(404);
    expect(error.responseJson).toEqual({ detail: "Not found" });
    expect(isCloudflareChallengeError(error)).toBe(false);
  });

  it("throws an ApiError recognized as a challenge on a Cloudflare challenge response", async () => {
    stubFetch(
      new Response("<!DOCTYPE html><title>Just a moment...</title>", {
        status: 403,
        statusText: "Forbidden",
        headers: { "cf-mitigated": "challenge", "Content-Type": "text/html" },
      })
    );
    const error = await fetchListings().catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.response.status).toBe(403);
    expect(error.responseJson).toBeUndefined();
    expect(isCloudflareChallengeError(error)).toBe(true);
  });
});
