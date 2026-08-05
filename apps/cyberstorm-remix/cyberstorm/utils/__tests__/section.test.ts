import { describe, expect, it } from "vitest";

import { getSectionDefault, getSectionSelection } from "../section";

const sections = [
  { uuid: "a", priority: 1 },
  { uuid: "b", priority: 3 },
  { uuid: "c", priority: 2 },
];

describe("utils.section.getSectionDefault", () => {
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

describe("utils.section.getSectionSelection", () => {
  it('keeps "all" selectable instead of collapsing it to no filter', () => {
    expect(getSectionSelection("all", sections)).toBe("all");
    expect(getSectionSelection("all", undefined)).toBe("all");
  });

  it('selects "all" when the community has no sections', () => {
    expect(getSectionSelection(null, [])).toBe("all");
    expect(getSectionSelection("x", [])).toBe("all");
  });

  it("otherwise resolves the same as getSectionDefault", () => {
    expect(getSectionSelection("c", sections)).toBe("c");
    expect(getSectionSelection("nonexistent", sections)).toBe("b");
    expect(getSectionSelection(null, sections)).toBe("b");
  });

  it("returns empty string while the section list is unknown", () => {
    expect(getSectionSelection(null, undefined)).toBe("");
  });
});
