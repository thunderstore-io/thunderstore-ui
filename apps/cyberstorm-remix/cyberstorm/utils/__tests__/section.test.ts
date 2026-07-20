import { describe, expect, it } from "vitest";

import { getSectionDefault } from "../section";

describe("utils.section.getSectionDefault", () => {
  const sections = [
    { uuid: "a", priority: 1 },
    { uuid: "b", priority: 3 },
    { uuid: "c", priority: 2 },
  ];

  it('clears the section filter for "all"', () => {
    expect(getSectionDefault("all", sections)).toBe("");
  });

  it("keeps a requested section the community actually has", () => {
    expect(getSectionDefault("c", sections)).toBe("c");
  });

  it("ignores a section the community does not have (junk/stale uuid would 400)", () => {
    expect(getSectionDefault("nonexistent", sections)).toBe("b");
  });

  it("defaults to the highest-priority section when none is requested", () => {
    expect(getSectionDefault(null, sections)).toBe("b");
  });

  it("trusts the requested section when the section list is unknown", () => {
    expect(getSectionDefault("whatever", undefined)).toBe("whatever");
  });

  it("returns empty string when there are no sections", () => {
    expect(getSectionDefault(null, [])).toBe("");
    expect(getSectionDefault("x", [])).toBe("");
  });
});
