import * as SentrySdk from "@sentry/react-router";
import type { ErrorEvent } from "@sentry/react-router";
import { afterEach, assert, describe, expect, it, vi } from "vitest";

import {
  beforeSend,
  denyUrls,
  heartbeatSuppressed4xx,
  isBoundaryOwned4xx,
  isExpectedRouteError,
  toReportableError,
} from "../sentry";

// heartbeatSuppressed4xx calls the SDK; nothing else under test does.
vi.mock("@sentry/react-router", () => ({
  captureMessage: vi.fn(),
}));

// This attempts to match how Sentry does things.
// https://docs.sentry.io/platforms/javascript/configuration/options/#denyUrls
const matchesStringOrRegExp = (
  value: string,
  stringOrRegExp: string | RegExp
): boolean => {
  if (typeof stringOrRegExp === "string") {
    if (value.includes(stringOrRegExp)) {
      return true;
    }
  } else {
    if (value.match(stringOrRegExp)) {
      return true;
    }
  }

  return false;
};

describe("utils.sentry.denyUrls", () => {
  it.each([
    ["btloader.com", true],
    ["api.btloader.com", true],
    ["https://btloader.com/foo", true],
    ["bitloader.com", false],
    ["https://s.nitropay.com/ads-785.js", true],
    ["https://adnxs.com/prebid/creative", true],
    ["https://doubleclick.net/pagead/js/foo.js", true],
    ["https://googlesyndication.com/pagead/js/foo.js", true],
    ["https://imasdk.googleapis.com/js/sdkloader/ima3.js", true],
    ["https://a.pub.network/ftUtils.js", true],
    ["https://s.cpx.to/p/20023/px.js", true],
    ["/app/apps/cyberstorm-remix/build/server/index.js", false],
    ["https://thunderstore.io/api/cyberstorm/listing/riskofrain2/", false],
    ["https://thunderstore.io/assets/entry.client-abc.js", false],
  ])("correctly classifies %s", (url, expectedToMatch) => {
    for (const stringOrRegExp of denyUrls) {
      const matches = matchesStringOrRegExp(url, stringOrRegExp);

      if (expectedToMatch && matches) {
        return; // Test successful
      }
      if (!expectedToMatch && matches) {
        assert.fail(`${url} was erroneously matched against ${stringOrRegExp}`);
      }
    }

    if (expectedToMatch) {
      assert.fail(`${url} was not caught by denyUrls config`);
    }
  });
});

describe("utils.sentry.beforeSend", () => {
  it("passes through events with no stack frames", () => {
    const event = { exception: { values: [] } } as unknown as ErrorEvent;
    expect(beforeSend(event)).toBe(event);
  });

  it("passes through events where frames have no filename", () => {
    const event = {
      exception: {
        values: [{ stacktrace: { frames: [{ lineno: 1 }] } }],
      },
    } as ErrorEvent;
    expect(beforeSend(event)).toBe(event);
  });

  it("drops events where all frames come from ad scripts", () => {
    const event = {
      exception: {
        values: [
          {
            stacktrace: {
              frames: [
                { filename: "https://s.nitropay.com/ads-785.js" },
                { filename: "https://s.nitropay.com/ads-785.js" },
              ],
            },
          },
        ],
      },
    } as ErrorEvent;
    expect(beforeSend(event)).toBeNull();
  });

  it("drops events where at least one frame comes from an ad script", () => {
    const event = {
      exception: {
        values: [
          {
            stacktrace: {
              frames: [
                { filename: "https://s.nitropay.com/ads-785.js" },
                {
                  filename:
                    "https://thunderstore.io/assets/entry.client-abc.js",
                },
              ],
            },
          },
        ],
      },
    } as ErrorEvent;
    expect(beforeSend(event)).toBeNull();
  });

  it("drops frameless cross-origin ad rejections matched by message", () => {
    // Browsers strip the stack for opaque-origin fetch rejections, so these
    // arrive frameless with the ad host only in the message text.
    const event = {
      exception: {
        values: [
          {
            type: "TypeError",
            value:
              "NetworkError when attempting to fetch resource. (diagnostics.id5-sync.com)",
          },
        ],
      },
    } as ErrorEvent;
    expect(beforeSend(event)).toBeNull();
  });

  it("passes through frameless events whose message is unrelated", () => {
    const event = {
      exception: {
        values: [
          { type: "TypeError", value: "Cannot read properties of null" },
        ],
      },
    } as ErrorEvent;
    expect(beforeSend(event)).toBe(event);
  });

  it("keeps an app error that only mentions an ad domain but has app frames", () => {
    // Message-matching is gated on being frameless: a real app error with a
    // usable stack must not be dropped just because its text names an ad host.
    const event = {
      exception: {
        values: [
          {
            type: "Error",
            value: "Failed near id5-sync.com integration",
            stacktrace: {
              frames: [
                {
                  filename:
                    "https://thunderstore.io/assets/entry.client-abc.js",
                },
              ],
            },
          },
        ],
      },
    } as ErrorEvent;
    expect(beforeSend(event)).toBe(event);
  });

  it("drops an ad rejection whose only frames are anonymous (matched by message)", () => {
    // Opaque cross-origin ad errors can arrive with anonymous/native frames
    // rather than truly frameless; those frames aren't usable for attribution,
    // so the message fallback must still run.
    const event = {
      exception: {
        values: [
          {
            type: "TypeError",
            value:
              "NetworkError when attempting to fetch resource. (diagnostics.id5-sync.com)",
            stacktrace: {
              frames: [
                { filename: "<anonymous>" },
                { filename: "<anonymous>" },
              ],
            },
          },
        ],
      },
    } as ErrorEvent;
    expect(beforeSend(event)).toBeNull();
  });

  it("keeps an anonymous-only-frame error whose message is unrelated to ads", () => {
    const event = {
      exception: {
        values: [
          {
            type: "TypeError",
            value: "Cannot read properties of null",
            stacktrace: {
              frames: [
                { filename: "<anonymous>" },
                { filename: "<anonymous>" },
              ],
            },
          },
        ],
      },
    } as ErrorEvent;
    expect(beforeSend(event)).toBe(event);
  });

  it("passes through events where exception is null", () => {
    const event = { exception: null } as unknown as ErrorEvent;
    expect(beforeSend(event)).toBe(event);
  });

  it("passes through events where exception is undefined", () => {
    const event = {} as ErrorEvent;
    expect(beforeSend(event)).toBe(event);
  });

  it("drops events matching a regex denyUrls entry", () => {
    // Temporarily add a regex pattern and verify it blocks matching frames.
    // We test the beforeSend logic by constructing a denyUrls-like check —
    // regex entries are supported by the same code path as strings.
    const event = {
      exception: {
        values: [
          {
            stacktrace: {
              frames: [{ filename: "https://cdn.example-adnet.io/tracker.js" }],
            },
          },
        ],
      },
    } as ErrorEvent;

    // Inject a regex into denyUrls for the duration of this test.
    const pattern = /example-adnet\.io/;
    denyUrls.push(pattern);
    try {
      expect(beforeSend(event)).toBeNull();
    } finally {
      denyUrls.splice(denyUrls.indexOf(pattern), 1);
    }
  });

  it("drops a Maximum call stack RangeError with no real-file frames", () => {
    // Extension-injected recursive property traps overflow entirely within
    // anonymous/native frames.
    const event = {
      exception: {
        values: [
          {
            type: "RangeError",
            value: "Maximum call stack size exceeded",
            stacktrace: {
              frames: [
                { filename: "<anonymous>" },
                { filename: "<anonymous>" },
              ],
            },
          },
        ],
      },
    } as ErrorEvent;
    expect(beforeSend(event)).toBeNull();
  });

  it("drops a frameless Maximum call stack RangeError", () => {
    const event = {
      exception: {
        values: [
          { type: "RangeError", value: "Maximum call stack size exceeded" },
        ],
      },
    } as ErrorEvent;
    expect(beforeSend(event)).toBeNull();
  });

  it("keeps a Maximum call stack overflow that runs through our bundle", () => {
    const event = {
      exception: {
        values: [
          {
            type: "RangeError",
            value: "Maximum call stack size exceeded",
            stacktrace: {
              frames: [
                { filename: "<anonymous>" },
                { filename: "https://thunderstore.io/assets/index-abc.js" },
              ],
            },
          },
        ],
      },
    } as ErrorEvent;
    expect(beforeSend(event)).toBe(event);
  });

  it("keeps a frameless RangeError that is not a stack overflow", () => {
    const event = {
      exception: {
        values: [{ type: "RangeError", value: "Invalid array length" }],
      },
    } as ErrorEvent;
    expect(beforeSend(event)).toBe(event);
  });
});

describe("utils.sentry.beforeSend proxied ad-script + browser-internal noise", () => {
  // Reconstructed from real production Sentry events. Ad scripts are proxied
  // through our own origin, so their frames carry host-less paths — which is why
  // several leaked past the host-based denyUrls.

  it("#1 drops the Google IMA ima3.js cross-origin SecurityError", () => {
    const event = {
      exception: {
        values: [
          {
            type: "SecurityError",
            value:
              "Failed to read a named property 'performance' from 'Window': An attempt was made to break through the security policy of the user agent.",
            stacktrace: { frames: [{ filename: "/js/sdkloader/ima3.js" }] },
          },
        ],
      },
    } as ErrorEvent;
    expect(beforeSend(event)).toBeNull();
  });

  it("#3 drops the Freestar ftUtils.js TypeError", () => {
    const event = {
      exception: {
        values: [
          {
            type: "TypeError",
            value: "Cannot read properties of null (reading 'document')",
            stacktrace: {
              frames: [
                { filename: "/ftUtils.js" },
                { filename: "/assets/entry.client-C6mKbqym.js" },
              ],
            },
          },
        ],
      },
    } as ErrorEvent;
    expect(beforeSend(event)).toBeNull();
  });

  it("#4 drops the adloox /api/init NS_ERROR (proxied, host-less path)", () => {
    const event = {
      exception: {
        values: [
          {
            type: "NS_ERROR_NOT_INITIALIZED",
            value: "",
            stacktrace: {
              frames: [
                { filename: "/api/init-6845t8qo4yd8s4f4if8a.js" },
                { filename: "/assets/entry.client-C6mKbqym.js" },
              ],
            },
          },
        ],
      },
    } as ErrorEvent;
    expect(beforeSend(event)).toBeNull();
  });

  it("#5 drops the /serve/load.js NS_ERROR (proxied, host-less path)", () => {
    const event = {
      exception: {
        values: [
          {
            type: "NS_ERROR_NOT_INITIALIZED",
            value: "",
            stacktrace: {
              frames: [
                { filename: "/serve/load.js" },
                { filename: "/assets/entry.client-C6mKbqym.js" },
              ],
            },
          },
        ],
      },
    } as ErrorEvent;
    expect(beforeSend(event)).toBeNull();
  });

  it("#2 keeps the React removeChild NotFoundError (prevented by hardenDom, not beforeSend)", () => {
    // A genuine React reconciliation signature — must NOT be blanket-dropped.
    // hardenDomAgainstTranslation (entry.client) neutralises the extension/
    // translator DOM mutation that triggers it, so it should stop occurring once
    // 8.28.0 ships; if one still slips through, beforeSend passes it on.
    const event = {
      exception: {
        values: [
          {
            type: "NotFoundError",
            value:
              "Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.",
            stacktrace: {
              frames: [
                { filename: "/assets/PackageSearch-DjQLx51N.js" },
                { filename: "/assets/index-Xg5WbocQ.js" },
              ],
            },
          },
        ],
      },
    } as ErrorEvent;
    expect(beforeSend(event)).toBe(event);
  });

  it("keeps a genuine same-origin SecurityError (not cross-origin)", () => {
    // Guard: only cross-origin / security-policy SecurityErrors are ad noise. A
    // real same-origin SecurityError from our code must still report.
    const event = {
      exception: {
        values: [
          {
            type: "SecurityError",
            value: "The operation is insecure.",
            stacktrace: {
              frames: [{ filename: "/assets/entry.client-C6mKbqym.js" }],
            },
          },
        ],
      },
    } as ErrorEvent;
    expect(beforeSend(event)).toBe(event);
  });
});

describe("utils.sentry.isExpectedRouteError", () => {
  // Matches the shape react-router's isRouteErrorResponse checks for,
  // i.e. what getInternalRouterError / thrown Responses produce.
  const routeErrorResponse = (status: number, data: unknown = null) => ({
    status,
    statusText: "",
    internal: true,
    data,
    error: new Error(String(data)),
  });

  it.each([
    [404, 'No route matches URL "/.well-known/acme-challenge/abc"'],
    [404, 'No route matches URL "/sldkfjklsdjf"'],
    [405, 'Invalid request method "OPTIONS"'],
    [405, 'You made a POST request to "/" but did not provide an `action`'],
    [401, "Unauthorized"],
    [403, "Forbidden"],
    [429, "Too Many Requests"],
  ])("returns true for expected %i route error responses", (status, data) => {
    expect(isExpectedRouteError(routeErrorResponse(status, data))).toBe(true);
  });

  it.each([500, 502, 503, 504])(
    "returns false for %i route error responses",
    (status) => {
      expect(isExpectedRouteError(routeErrorResponse(status))).toBe(false);
    }
  );

  // ssrLoader converts 4xx ApiErrors to thrown Responses; the router
  // deserializes them as ErrorResponses with internal=false. These mirror the
  // ApiError allowlist rather than being blanket-suppressed.
  const loaderThrownResponse = (status: number) => ({
    status,
    statusText: "",
    internal: false,
    data: `{"status":${status},"statusText":"","url":"https://example/api"}`,
  });

  it.each([403, 404, 410, 401])(
    "returns true for loader-thrown %i (normal-browsing allowlist)",
    (status) => {
      expect(isExpectedRouteError(loaderThrownResponse(status))).toBe(true);
    }
  );

  it.each([400, 405, 409, 422, 429])(
    "returns false for loader-thrown %i (SSR 4xx reports by default)",
    (status) => {
      // A Cloudflare 429 or contract-drift 400 during SSR must not be
      // silently swallowed just because ssrLoader wrapped it in a Response.
      expect(isExpectedRouteError(loaderThrownResponse(status))).toBe(false);
    }
  );

  it("still suppresses router-internal 4xx wholesale (bot noise)", () => {
    // internal:true = unmatched-URL 404s / bad-method 405s the router itself
    // raised — those stay expected regardless of status.
    expect(isExpectedRouteError(routeErrorResponse(429))).toBe(true);
    expect(isExpectedRouteError(routeErrorResponse(400))).toBe(true);
  });

  it("returns false for plain Errors", () => {
    expect(isExpectedRouteError(new Error("loader exploded"))).toBe(false);
  });

  // clientLoaders throw ApiError directly rather than a Response, matching what
  // isApiError() recognizes (message + response.status + responseJson key).
  const apiError = (status: number) => ({
    message: `${status}: `,
    response: { headers: {}, status, statusText: "", url: "" },
    responseJson: undefined,
  });

  it.each([403, 404, 410])(
    "returns true for %i ApiErrors (normal-browsing allowlist)",
    (status) => {
      expect(isExpectedRouteError(apiError(status))).toBe(true);
    }
  );

  it.each([400, 405, 409, 422, 429])(
    "returns false for %i ApiErrors (4xx reports by default)",
    (status) => {
      expect(isExpectedRouteError(apiError(status))).toBe(false);
    }
  );

  it("treats 401 ApiErrors as expected without session context", () => {
    // Gates without session context (onError, handleError) defer the real
    // decision to RouteErrorBoundary.
    expect(isExpectedRouteError(apiError(401))).toBe(true);
    expect(isExpectedRouteError(apiError(401), {})).toBe(true);
    expect(isExpectedRouteError(apiError(401), { anonymous: true })).toBe(true);
  });

  it("reports 401 ApiErrors for logged-in users (auth regression)", () => {
    expect(isExpectedRouteError(apiError(401), { anonymous: false })).toBe(
      false
    );
  });

  it.each([500, 502, 503, 504])("returns false for %i ApiErrors", (status) => {
    expect(isExpectedRouteError(apiError(status))).toBe(false);
  });

  it("returns false for null and undefined", () => {
    expect(isExpectedRouteError(null)).toBe(false);
    expect(isExpectedRouteError(undefined)).toBe(false);
  });

  it("returns false for objects that only resemble a response", () => {
    // Missing the `internal` boolean which isRouteErrorResponse requires.
    expect(
      isExpectedRouteError({ status: 404, statusText: "", data: null })
    ).toBe(false);
  });
});

describe("utils.sentry.heartbeatSuppressed4xx", () => {
  const apiError = (status: number) => ({
    message: `${status}: `,
    response: { headers: {}, status, statusText: "", url: "" },
    responseJson: undefined,
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.mocked(SentrySdk.captureMessage).mockClear();
  });

  it("emits a grouped warning for a sampled suppressed ApiError", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    heartbeatSuppressed4xx(apiError(404));
    expect(SentrySdk.captureMessage).toHaveBeenCalledWith(
      "Suppressed client 4xx: 404",
      {
        level: "warning",
        fingerprint: ["suppressed-4xx", "404"],
        tags: { suppressed_status: "404" },
      }
    );
  });

  it("stays silent outside the sample", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99);
    heartbeatSuppressed4xx(apiError(404));
    expect(SentrySdk.captureMessage).not.toHaveBeenCalled();
  });

  it("never fires for route ErrorResponses (bot-404 noise stays silent)", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    heartbeatSuppressed4xx({
      status: 404,
      statusText: "",
      internal: true,
      data: null,
      error: new Error("No route matches URL"),
    });
    expect(SentrySdk.captureMessage).not.toHaveBeenCalled();
  });
});

describe("utils.sentry.toReportableError", () => {
  const routeErrorResponse = (status: number, statusText = "") => ({
    status,
    statusText,
    internal: true,
    data: null,
    error: new Error(statusText),
  });

  it("wraps a route ErrorResponse in a named Error grouped by status", () => {
    const result = toReportableError(
      routeErrorResponse(500, "Internal Server Error")
    );
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).name).toBe("RouteErrorResponse");
    expect((result as Error).message).toBe(
      "RouteErrorResponse 500 Internal Server Error"
    );
  });

  it("omits trailing whitespace when statusText is empty", () => {
    const result = toReportableError(routeErrorResponse(502));
    expect((result as Error).message).toBe("RouteErrorResponse 502");
  });

  it("adopts the underlying error's stack and keeps it as cause", () => {
    // Internal 5xx responses carry the Error the loader actually threw on
    // `.error`; its stack points at the real failure, not this wrapper.
    const original = new Error("db connection refused");
    original.stack =
      "Error: db connection refused\n    at load (app/routes/team.tsx:42:11)";
    const result = toReportableError({
      status: 500,
      statusText: "Internal Server Error",
      internal: true,
      data: original.toString(),
      error: original,
    }) as Error & { cause?: unknown };

    // Message/name still drive grouping...
    expect(result.name).toBe("RouteErrorResponse");
    expect(result.message).toBe("RouteErrorResponse 500 Internal Server Error");
    // ...but the real stack and original error are preserved for debugging.
    expect(result.stack).toBe(original.stack);
    expect(result.cause).toBe(original);
  });

  it("wraps a route ErrorResponse with no underlying Error without a cause", () => {
    // Deserialized (non-internal) responses have no `.error`; wrapping must not
    // throw and leaves the wrapper's own stack in place.
    const result = toReportableError({
      status: 503,
      statusText: "Service Unavailable",
      internal: false,
      data: "{}",
    }) as Error & { cause?: unknown };

    expect(result.message).toBe("RouteErrorResponse 503 Service Unavailable");
    expect(result.cause).toBeUndefined();
  });

  it("passes ApiError and plain Errors through unchanged", () => {
    const apiError = {
      message: "500: ",
      response: { headers: {}, status: 500, statusText: "", url: "" },
      responseJson: undefined,
    };
    expect(toReportableError(apiError)).toBe(apiError);

    const plain = new Error("boom");
    expect(toReportableError(plain)).toBe(plain);
  });
});

describe("utils.sentry.isBoundaryOwned4xx", () => {
  // clientLoaders throw ApiError directly (see isApiError).
  const apiError = (status: number) => ({
    message: `${status}: `,
    response: { headers: {}, status, statusText: "", url: "" },
    responseJson: undefined,
  });
  // ssrLoader 4xx arrive as router-serialized ErrorResponse objects — the shape
  // captured raw as "Object captured as exception with keys: ...".
  const routeErrorResponse = (status: number) => ({
    status,
    statusText: "",
    internal: false,
    data: null,
  });

  it.each([400, 405, 409, 422, 429])(
    "is true for %i ApiErrors (RouteErrorBoundary reports them)",
    (status) => {
      expect(isBoundaryOwned4xx(apiError(status))).toBe(true);
    }
  );

  it.each([400, 429])(
    "is true for loader-thrown %i RouteErrorResponse objects",
    (status) => {
      expect(isBoundaryOwned4xx(routeErrorResponse(status))).toBe(true);
    }
  );

  it.each([500, 502, 503])(
    "is false for %i — both gates report and dedupe",
    (status) => {
      expect(isBoundaryOwned4xx(apiError(status))).toBe(false);
      expect(isBoundaryOwned4xx(routeErrorResponse(status))).toBe(false);
    }
  );

  it("is false for non-HTTP errors and nullish input", () => {
    expect(isBoundaryOwned4xx(new Error("loader exploded"))).toBe(false);
    expect(isBoundaryOwned4xx(null)).toBe(false);
    expect(isBoundaryOwned4xx(undefined)).toBe(false);
  });
});
