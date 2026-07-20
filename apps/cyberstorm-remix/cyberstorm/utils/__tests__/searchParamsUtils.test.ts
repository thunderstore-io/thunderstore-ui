import { describe, expect, it } from "vitest";

import { parsePageParam } from "../searchParamsUtils";

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
