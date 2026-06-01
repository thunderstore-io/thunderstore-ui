import type { ErrorEvent } from "@sentry/react-router";
import { assert, describe, expect, it } from "vitest";

import { beforeSend, denyUrls } from "../sentry";

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
    ["/app/apps/cyberstorm-remix/build/server/index.js", false],
    ["https://thunderstore.io/api/cyberstorm/listing/riskofrain2/", false],
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
                    "https://thunderstore.io/__remix/entry.client-abc.js",
                },
              ],
            },
          },
        ],
      },
    } as ErrorEvent;
    expect(beforeSend(event)).toBeNull();
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
});
