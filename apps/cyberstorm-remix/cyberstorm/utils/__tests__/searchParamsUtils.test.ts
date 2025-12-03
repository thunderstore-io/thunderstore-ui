import { describe, expect, it, vi } from "vitest";

import {
  parseIntegerSearchParam,
  setParamsBlobValue,
} from "../searchParamsUtils";

describe("setParamsBlobValue", () => {
  it("returns a function that updates the blob with the new value", () => {
    const setter = vi.fn();
    const oldBlob = { foo: "bar", baz: 1 };
    const key = "foo";

    const updateFoo = setParamsBlobValue(setter, oldBlob, key);
    updateFoo("qux");

    expect(setter).toHaveBeenCalledWith({ foo: "qux", baz: 1 });
  });

  it("adds a new key if it did not exist", () => {
    const setter = vi.fn();
    const oldBlob: { foo: string; baz?: number } = { foo: "bar" };
    const key = "baz";

    const updateBaz = setParamsBlobValue(setter, oldBlob, key);
    updateBaz(2);

    expect(setter).toHaveBeenCalledWith({ foo: "bar", baz: 2 });
  });
});

describe("parseIntegerSearchParam", () => {
  it("returns undefined for null", () => {
    expect(parseIntegerSearchParam(null)).toBeUndefined();
  });

  it("returns undefined for empty string", () => {
    expect(parseIntegerSearchParam("")).toBeUndefined();
  });

  it("returns undefined for whitespace string", () => {
    expect(parseIntegerSearchParam("   ")).toBeUndefined();
  });

  it("returns undefined for non-numeric string", () => {
    expect(parseIntegerSearchParam("abc")).toBeUndefined();
    expect(parseIntegerSearchParam("123a")).toBeUndefined();
    expect(parseIntegerSearchParam("a123")).toBeUndefined();
  });

  it("returns undefined for float string", () => {
    expect(parseIntegerSearchParam("12.34")).toBeUndefined();
  });

  it("returns integer for valid integer string", () => {
    expect(parseIntegerSearchParam("123")).toBe(123);
    expect(parseIntegerSearchParam("0")).toBe(0);
    expect(parseIntegerSearchParam("  456  ")).toBe(456);
  });

  it("returns undefined for unsafe integers", () => {
    // Number.MAX_SAFE_INTEGER is 9007199254740991
    const unsafe = "9007199254740992";
    expect(parseIntegerSearchParam(unsafe)).toBeUndefined();
  });
});
