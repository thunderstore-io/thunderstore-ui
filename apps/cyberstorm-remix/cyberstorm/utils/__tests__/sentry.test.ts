import { assert, describe, it } from "vitest";
import { denyUrls } from "../sentry";

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
