import { describe, expect, it } from "vitest";

import { ApiError, isCloudflareChallengeError } from "../errors";

function apiError(headers: Record<string, string> = {}): ApiError {
  return new ApiError({
    message: "403: Forbidden",
    response: {
      headers,
      status: 403,
      statusText: "Forbidden",
      url: "https://api.example.org/api/cyberstorm/listing/",
    },
  });
}

describe("isCloudflareChallengeError", () => {
  it("detects an ApiError from a Cloudflare challenge response", () => {
    expect(
      isCloudflareChallengeError(apiError({ "cf-mitigated": "challenge" }))
    ).toBe(true);
  });

  it("ignores an ApiError without the challenge header", () => {
    expect(isCloudflareChallengeError(apiError())).toBe(false);
  });

  it("ignores other mitigation values", () => {
    expect(
      isCloudflareChallengeError(apiError({ "cf-mitigated": "block" }))
    ).toBe(false);
  });

  it("ignores non-ApiError values", () => {
    expect(isCloudflareChallengeError(new Error("403"))).toBe(false);
    expect(isCloudflareChallengeError(undefined)).toBe(false);
  });
});
