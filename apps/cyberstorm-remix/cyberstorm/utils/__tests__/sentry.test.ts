import type { ErrorEvent } from "@sentry/react-router";
import { assert, describe, expect, it } from "vitest";

import {
  beforeSend,
  denyUrls,
  isExpectedRouteError,
  toReportableError,
} from "../sentry";

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

  it("returns true for loader-thrown Responses deserialized by the router", () => {
    // ssrLoader converts 4xx ApiErrors to thrown Responses; on the client
    // these surface as ErrorResponses with internal=false and no `error`.
    expect(
      isExpectedRouteError({
        status: 404,
        statusText: "",
        internal: false,
        data: '{"status":404,"statusText":"","url":"https://example/api"}',
      })
    ).toBe(true);
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

  it.each([401, 403, 404, 429])(
    "returns true for %i ApiErrors thrown by clientLoaders",
    (status) => {
      expect(isExpectedRouteError(apiError(status))).toBe(true);
    }
  );

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
