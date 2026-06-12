import { describe, expect, it } from "vitest";

import { cacheControl } from "../cache";

const value = (options?: Parameters<typeof cacheControl>[0]) =>
  cacheControl(options)["Cache-Control"];

describe("cacheControl", () => {
  it("emits the default public directive set", () => {
    expect(value()).toBe(
      "public, max-age=60, s-maxage=300, stale-while-revalidate=600"
    );
  });

  it("honors custom public durations", () => {
    expect(
      value({ browserMaxAge: 30, cdnMaxAge: 120, staleWhileRevalidate: 90 })
    ).toBe("public, max-age=30, s-maxage=120, stale-while-revalidate=90");
  });

  it("emits only private + max-age when isPrivate (no s-maxage / SWR)", () => {
    const result = value({
      isPrivate: true,
      browserMaxAge: 45,
      cdnMaxAge: 999,
      staleWhileRevalidate: 999,
    });
    expect(result).toBe("private, max-age=45");
    expect(result).not.toContain("s-maxage");
    expect(result).not.toContain("stale-while-revalidate");
  });

  it("clamps negative values to 0", () => {
    expect(value({ browserMaxAge: -5, cdnMaxAge: -1 })).toBe(
      "public, max-age=0, s-maxage=0, stale-while-revalidate=600"
    );
  });

  it("floors non-integer values", () => {
    expect(value({ browserMaxAge: 60.9, staleWhileRevalidate: 10.2 })).toBe(
      "public, max-age=60, s-maxage=300, stale-while-revalidate=10"
    );
  });

  it("coerces non-finite values (NaN/Infinity) to 0", () => {
    expect(value({ browserMaxAge: NaN, cdnMaxAge: Infinity })).toBe(
      "public, max-age=0, s-maxage=0, stale-while-revalidate=600"
    );
  });

  it("clamps the private branch too", () => {
    expect(value({ isPrivate: true, browserMaxAge: -10 })).toBe(
      "private, max-age=0"
    );
  });
});
