import { describe, expect, it } from "vitest";

import { parseIntListParam, parsePageParam } from "../searchParamsUtils";

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
});
