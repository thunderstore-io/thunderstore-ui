import { describe, expect, it } from "vitest";

import {
  buildPageHref,
  parseIntListParam,
  parsePageParam,
  parseSearchParam,
} from "../searchParamsUtils";

describe("utils.searchParamsUtils.parsePageParam", () => {
  it("returns a valid 1-based page number", () => {
    expect(parsePageParam("1")).toBe(1);
    expect(parsePageParam("2")).toBe(2);
    expect(parsePageParam("99999")).toBe(99999);
  });

  it("returns undefined for absent, non-numeric, or < 1 values", () => {
    // The listing loaders pass undefined straight to the API, which omits
    // ?page (serving page 1) instead of 500ing on NaN — the bug this guards.
    expect(parsePageParam(null)).toBeUndefined();
    expect(parsePageParam("")).toBeUndefined();
    expect(parsePageParam("abc")).toBeUndefined();
    expect(parsePageParam("-1")).toBeUndefined();
    expect(parsePageParam("0")).toBeUndefined();
  });

  it("returns undefined for unsafe integers", () => {
    expect(parsePageParam("99999999999999999999")).toBeUndefined();
  });

  it("rejects partially-numeric and non-decimal values", () => {
    expect(parsePageParam("1abc")).toBeUndefined();
    expect(parsePageParam("1e3")).toBeUndefined();
    expect(parsePageParam("0x10")).toBeUndefined();
  });
});

describe("utils.searchParamsUtils.parseIntListParam", () => {
  const params = (qs: string) => new URLSearchParams(qs);

  it("keeps valid positive-integer ids", () => {
    expect(parseIntListParam(params("x=17"), "x")).toEqual(["17"]);
    expect(parseIntListParam(params("x=1&x=2"), "x")).toEqual(["1", "2"]);
  });

  it("splits comma-separated values", () => {
    expect(parseIntListParam(params("x=1,2,3"), "x")).toEqual(["1", "2", "3"]);
  });

  it("combines repeated keys + comma values and drops invalid ones", () => {
    expect(parseIntListParam(params("x=1,abc,2&x=3&x=-1"), "x")).toEqual([
      "1",
      "2",
      "3",
    ]);
  });

  it("dedupes", () => {
    expect(parseIntListParam(params("x=1,1&x=1"), "x")).toEqual(["1"]);
  });

  it("returns undefined when absent or every value is invalid", () => {
    expect(parseIntListParam(params(""), "x")).toBeUndefined();
    expect(parseIntListParam(params("x=abc"), "x")).toBeUndefined();
    expect(parseIntListParam(params("x=-1&x=0&x=1.5"), "x")).toBeUndefined();
  });

  it("drops non-decimal and unsafe-integer tokens", () => {
    expect(parseIntListParam(params("x=0x10"), "x")).toBeUndefined();
    expect(parseIntListParam(params("x=5abc&x=6"), "x")).toEqual(["6"]);
    expect(
      parseIntListParam(params("x=99999999999999999999"), "x")
    ).toBeUndefined();
  });

  it("caps how many ids one URL can push into the API query", () => {
    // A header-limit-sized query string otherwise packs thousands of ids into
    // the listing API's `IN` clause, and each unique URL misses the CDN.
    const many = Array.from({ length: 500 }, (_, i) => i + 1).join(",");
    const capped = parseIntListParam(params(`x=${many}`), "x");
    expect(capped).toHaveLength(100);
    expect(capped?.[0]).toBe("1");

    // The cap counts unique ids, so repeats don't burn through it.
    const repeated = `${"7,".repeat(500)}8`;
    expect(parseIntListParam(params(`x=${repeated}`), "x")).toEqual(["7", "8"]);
  });
});

describe("utils.searchParamsUtils.parseSearchParam", () => {
  // Built from char codes so the control bytes stay visible in the source.
  const NUL = String.fromCharCode(0);
  const LF = String.fromCharCode(10);
  const DEL = String.fromCharCode(127);
  const C1 = String.fromCharCode(0x9b);

  it("passes ordinary search terms through", () => {
    expect(parseSearchParam("bepinex")).toBe("bepinex");
    expect(parseSearchParam("two words")).toBe("two words");
    expect(parseSearchParam("dash-and_underscore")).toBe("dash-and_underscore");
  });

  it("strips control characters", () => {
    // `?search=%00` was forwarded to the API raw and came back 400 — the bug
    // this guards. C0, DEL and C1 are all Unicode Cc.
    expect(parseSearchParam(`be${NUL}pinex`)).toBe("bepinex");
    expect(parseSearchParam(`line${LF}break`)).toBe("linebreak");
    expect(parseSearchParam(`a${DEL}b${C1}cd`)).toBe("abcd");
  });

  it("returns an empty string when absent or all control characters", () => {
    // "" and undefined are filtered out identically when the query string is
    // built, so an all-control-character search behaves as if never provided.
    expect(parseSearchParam(null)).toBe("");
    expect(parseSearchParam("")).toBe("");
    expect(parseSearchParam("   ")).toBe("");
    expect(parseSearchParam(NUL)).toBe("");
  });

  it("trims surrounding whitespace", () => {
    expect(parseSearchParam("  bepinex  ")).toBe("bepinex");
  });
});

describe("utils.searchParamsUtils.buildPageHref", () => {
  const PATH = "/c/how-to-fish/";
  const href = (page: number, query = "") =>
    buildPageHref(PATH, new URLSearchParams(query), page);

  it("links to a later page", () => {
    expect(href(2)).toBe("/c/how-to-fish/?page=2");
  });

  it("omits the param for page 1 so it keeps a single URL", () => {
    expect(href(1)).toBe(PATH);
    expect(href(0)).toBe(PATH);
  });

  it("carries the active filters into the link", () => {
    expect(href(3, "section=mods&nsfw=true")).toBe(
      "/c/how-to-fish/?section=mods&nsfw=true&page=3"
    );
  });

  it("replaces an existing page rather than appending a second one", () => {
    expect(href(4, "page=2&section=mods")).toBe(
      "/c/how-to-fish/?page=4&section=mods"
    );
  });

  it("drops the page from a filtered first page", () => {
    expect(href(1, "page=5&search=fish")).toBe("/c/how-to-fish/?search=fish");
  });

  it("keeps repeated params, which the category filters rely on", () => {
    expect(href(2, "includedCategories=1&includedCategories=2")).toBe(
      "/c/how-to-fish/?includedCategories=1&includedCategories=2&page=2"
    );
  });

  it("normalises the pathname to the canonical trailing-slash form", () => {
    expect(buildPageHref("/c/how-to-fish", new URLSearchParams(""), 2)).toBe(
      "/c/how-to-fish/?page=2"
    );
    expect(buildPageHref("/c/how-to-fish", new URLSearchParams(""), 1)).toBe(
      "/c/how-to-fish/"
    );
  });

  it("returns a root-relative path, not a bare query", () => {
    expect(href(2).startsWith("/")).toBe(true);
  });

  it("round-trips through the parser the loader uses", () => {
    const parsed = new URL(href(7), "https://thunderstore.io").searchParams;
    expect(parsePageParam(parsed.get("page"))).toBe(7);
  });
});
