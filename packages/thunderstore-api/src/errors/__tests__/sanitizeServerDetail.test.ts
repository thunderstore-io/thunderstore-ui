import { describe, expect, it } from "vitest";

import { sanitizeServerDetail } from "../sanitizeServerDetail";

describe("sanitizeServerDetail", () => {
  it("returns empty string for empty input", () => {
    expect(sanitizeServerDetail("")).toBe("");
  });

  it("removes control characters", () => {
    // ASCII 0-31 and 127 are control characters
    expect(sanitizeServerDetail("Hello\x00World")).toBe("Hello World");
    expect(sanitizeServerDetail("Hello\x1FWorld")).toBe("Hello World");
    expect(sanitizeServerDetail("Hello\x7FWorld")).toBe("Hello World");
  });

  it("collapses whitespace", () => {
    expect(sanitizeServerDetail("  Hello   World  ")).toBe("Hello World");
    expect(sanitizeServerDetail("Hello\t\nWorld")).toBe("Hello World");
  });

  it("handles combination of control characters and whitespace", () => {
    expect(sanitizeServerDetail("  Hello \x00  World  ")).toBe("Hello World");
  });

  it("returns empty string if result is only whitespace/control characters", () => {
    expect(sanitizeServerDetail("   \x00  ")).toBe("");
  });

  it("truncates long strings", () => {
    const longString = "a".repeat(401);
    const expected = "a".repeat(400) + "…";
    expect(sanitizeServerDetail(longString)).toBe(expected);
  });

  it("does not truncate strings of exactly max length", () => {
    const longString = "a".repeat(400);
    expect(sanitizeServerDetail(longString)).toBe(longString);
  });

  it("trims before truncating when slice ends in space", () => {
    // "a" * 399 + " " + "b"
    // cleaned: "a...a b" (length 401)
    // slice(0, 400) -> "a...a " (length 400, ends in space)
    // trim() -> "a...a" (length 399)
    // result -> "a...a…"
    const input = "a".repeat(399) + " b";
    const expected = "a".repeat(399) + "…";
    expect(sanitizeServerDetail(input)).toBe(expected);
  });

  it("preserves non-ASCII characters and emojis", () => {
    expect(sanitizeServerDetail("Héllo Wörld")).toBe("Héllo Wörld");
    expect(sanitizeServerDetail("Hello 🌍 World")).toBe("Hello 🌍 World");
  });
});
