import { describe, expect, it } from "vitest";

import { isSsrChallengeResponse } from "../challengeSsr";

// Matches the shape react-router's isRouteErrorResponse checks for,
// i.e. what getInternalRouterError / thrown Responses produce.
const routeErrorResponse = (status: number, data: unknown) => ({
  status,
  statusText: "",
  internal: false,
  data,
});

describe("isSsrChallengeResponse", () => {
  it("recognizes a route error response marked by ssrLoader", () => {
    const error = routeErrorResponse(503, {
      status: 403,
      statusText: "Forbidden",
      url: "https://thunderstore.dev/api/cyberstorm/listing/",
      cfChallenge: true,
    });
    expect(isSsrChallengeResponse(error)).toBe(true);
  });

  it("rejects route error responses without the marker", () => {
    const error = routeErrorResponse(403, {
      status: 403,
      statusText: "Forbidden",
      url: "https://thunderstore.dev/api/cyberstorm/listing/",
    });
    expect(isSsrChallengeResponse(error)).toBe(false);
  });

  it("rejects route error responses with non-object data", () => {
    expect(isSsrChallengeResponse(routeErrorResponse(503, null))).toBe(false);
    expect(isSsrChallengeResponse(routeErrorResponse(503, "challenged"))).toBe(
      false
    );
  });

  it("rejects objects where the marker is not strictly true", () => {
    expect(
      isSsrChallengeResponse(routeErrorResponse(503, { cfChallenge: "true" }))
    ).toBe(false);
  });

  it("rejects non route error response values", () => {
    expect(isSsrChallengeResponse(new Error("503"))).toBe(false);
    expect(isSsrChallengeResponse({ cfChallenge: true })).toBe(false);
    expect(isSsrChallengeResponse(undefined)).toBe(false);
  });
});
