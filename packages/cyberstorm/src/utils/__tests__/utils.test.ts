import { describe, expect, it } from "vitest";

import { formatAsCount } from "../utils";

describe("formatAsCount", () => {
  it("leaves counts below the compact threshold untouched", () => {
    expect(formatAsCount(0)).toBe("0");
    expect(formatAsCount(1)).toBe("1");
    expect(formatAsCount(999)).toBe("999");
  });

  it("keeps at most one decimal at the K boundaries", () => {
    expect(formatAsCount(1_000)).toBe("1K");
    expect(formatAsCount(1_234)).toBe("1.2K");
    expect(formatAsCount(9_999)).toBe("9.9K");
    expect(formatAsCount(12_345)).toBe("12.3K");
    expect(formatAsCount(99_999)).toBe("99.9K");
    expect(formatAsCount(123_456)).toBe("123.4K");
    expect(formatAsCount(999_999)).toBe("999.9K");
  });

  it("keeps at most one decimal at the M and B boundaries", () => {
    expect(formatAsCount(1_234_567)).toBe("1.2M");
    expect(formatAsCount(12_345_678)).toBe("12.3M");
    expect(formatAsCount(999_999_999)).toBe("999.9M");
    expect(formatAsCount(1_000_000_000)).toBe("1B");
  });

  it("truncates instead of rounding up", () => {
    expect(formatAsCount(1_999)).toBe("1.9K");
    expect(formatAsCount(1_099)).toBe("1K");
  });

  it("never renders more than one decimal place", () => {
    for (let exponent = 0; exponent < 12; exponent++) {
      for (const digits of [1, 2345, 6789, 9999]) {
        const formatted = formatAsCount(digits * 10 ** exponent);
        expect(formatted).toMatch(/^\d{1,3}(\.\d)?[KMBT]?$/);
      }
    }
  });
});
