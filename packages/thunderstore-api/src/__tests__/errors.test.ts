import { describe, expect, it } from "vitest";

import { ApiError, isCloudflareChallengeError } from "../errors";

const apiError = (status: number, headers: Record<string, string> = {}) =>
  new ApiError({
    message: `${status}: error`,
    response: {
      headers,
      status,
      statusText: "",
      url: "https://thunderstore.localhost/api/cyberstorm/listing/riskofrain2/",
    },
  });

describe("isCloudflareChallengeError", () => {
  it("is true for an ApiError carrying the cf-mitigated challenge header", () => {
    expect(
      isCloudflareChallengeError(apiError(403, { "cf-mitigated": "challenge" }))
    ).toBe(true);
    expect(
      isCloudflareChallengeError(apiError(503, { "cf-mitigated": "challenge" }))
    ).toBe(true);
  });

  it("is false for a forbidden response without the header", () => {
    expect(isCloudflareChallengeError(apiError(403))).toBe(false);
    expect(
      isCloudflareChallengeError(apiError(403, { "cf-mitigated": "block" }))
    ).toBe(false);
  });

  it("is false for values that are not ApiErrors", () => {
    expect(isCloudflareChallengeError(new Error("challenge"))).toBe(false);
    expect(isCloudflareChallengeError(null)).toBe(false);
    expect(isCloudflareChallengeError(undefined)).toBe(false);
    expect(
      isCloudflareChallengeError({
        response: { headers: { "cf-mitigated": "challenge" }, status: 403 },
      })
    ).toBe(false);
  });

  it("recognises a challenge page built from a real Response", async () => {
    const error = await ApiError.createFromResponse(
      new Response("<!doctype html><title>Just a moment...</title>", {
        status: 403,
        statusText: "Forbidden",
        headers: {
          "content-type": "text/html; charset=UTF-8",
          "cf-mitigated": "challenge",
        },
      })
    );

    expect(isCloudflareChallengeError(error)).toBe(true);
    expect(error.responseJson).toBeUndefined();
  });
});
