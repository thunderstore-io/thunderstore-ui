import { describe, expect, test, vi } from "vitest";

import { type Section } from "@thunderstore/dapper/types";

import { type CategorySelection } from "../../types";
import {
  type SearchParamsType,
  clearAll,
  compareSearchParamBlobs,
  parseCategories,
  resetParams,
  searchParamsToBlob,
  setParamsBlobCategories,
  synchronizeSearchParams,
} from "../PackageSearchLogic";

describe("searchParamsToBlob", () => {
  const sections: Section[] = [
    {
      uuid: "section-1",
      name: "Section 1",
      priority: 1,
      slug: "",
    },
    {
      uuid: "section-2",
      name: "Section 2",
      priority: 0,
      slug: "",
    },
  ];

  test("uses default values for empty searchParams", () => {
    const params = new URLSearchParams();
    const result = searchParamsToBlob(params);

    expect(result).toEqual({
      search: "",
      order: undefined,
      section: "",
      deprecated: false,
      nsfw: false,
      page: 1,
      includedCategories: "",
      excludedCategories: "",
    });
  });

  test("parses regular standard string parameters correctly", () => {
    const params = new URLSearchParams();
    params.set("search", "mod");
    params.set("ordering", "last-updated");
    params.set("section", "my-section");
    params.set("deprecated", "true");
    params.set("nsfw", "false");
    params.set("page", "2");
    params.set("includedCategories", "cat1");
    params.set("excludedCategories", "cat2,cat3");

    const result = searchParamsToBlob(params);

    expect(result).toEqual({
      search: "mod",
      order: "last-updated", // PackageOrderOptions.Updated is typically 'last-updated'
      section: "my-section",
      deprecated: true,
      nsfw: false,
      page: 2,
      includedCategories: "cat1",
      excludedCategories: "cat2,cat3",
    });
  });

  test("combines multiple search queries into a single space-separated string", () => {
    const params = new URLSearchParams();
    params.append("search", "hello");
    params.append("search", "world");

    const result = searchParamsToBlob(params);
    expect(result.search).toBe("hello world");
  });

  test("selects the highest-priority section when section param is empty", () => {
    const params = new URLSearchParams();
    const result = searchParamsToBlob(params, sections);

    expect(result.section).toBe("section-1");
  });

  test("handles empty sections array correctly", () => {
    const params = new URLSearchParams();
    const result = searchParamsToBlob(params, []);

    expect(result.section).toBe("");
  });

  test("handles invalid integer for page", () => {
    const params = new URLSearchParams();
    params.set("page", "invalid");
    const result = searchParamsToBlob(params);
    expect(result.page).toBe(1);
  });

  test("handles deprecated/nsfw true/false strings", () => {
    let params = new URLSearchParams();
    params.set("deprecated", "false");
    params.set("nsfw", "true");
    let result = searchParamsToBlob(params);
    expect(result.deprecated).toBe(false);
    expect(result.nsfw).toBe(true);

    params = new URLSearchParams();
    params.set("deprecated", "true");
    params.set("nsfw", "false");
    result = searchParamsToBlob(params);
    expect(result.deprecated).toBe(true);
    expect(result.nsfw).toBe(false);

    params = new URLSearchParams();
    params.set("deprecated", "random");
    params.set("nsfw", "random");
    result = searchParamsToBlob(params);
    expect(result.deprecated).toBe(false);
    expect(result.nsfw).toBe(false);
  });
});

describe("parseCategories", () => {
  const categories: CategorySelection[] = [
    { id: "1", name: "Cat 1", slug: "cat-1", selection: "off" },
    { id: "2", name: "Cat 2", slug: "cat-2", selection: "off" },
    { id: "3", name: "Cat 3", slug: "cat-3", selection: "off" },
  ];

  test("returns empty array if categories are not provided", () => {
    expect(parseCategories("", "")).toEqual([]);
  });

  test("handles empty inclusion/exclusion strings correctly", () => {
    const result = parseCategories("", "", categories);
    expect(result).toEqual(categories);
  });

  test("maps inclusion strings to selection: 'include'", () => {
    const result = parseCategories("1", "", categories);
    expect(result.find((c) => c.id === "1")?.selection).toBe("include");
    expect(result.find((c) => c.id === "2")?.selection).toBe("off");
    expect(result.find((c) => c.id === "3")?.selection).toBe("off");
  });

  test("maps exclusion strings to selection: 'exclude'", () => {
    const result = parseCategories("", "2,3", categories);
    expect(result.find((c) => c.id === "1")?.selection).toBe("off");
    expect(result.find((c) => c.id === "2")?.selection).toBe("exclude");
    expect(result.find((c) => c.id === "3")?.selection).toBe("exclude");
  });

  test("maps both inclusion and exclusion alongside each other", () => {
    const result = parseCategories("1", "3", categories);
    expect(result.find((c) => c.id === "1")?.selection).toBe("include");
    expect(result.find((c) => c.id === "2")?.selection).toBe("off");
    expect(result.find((c) => c.id === "3")?.selection).toBe("exclude");
  });
});

describe("compareSearchParamBlobs", () => {
  const baseBlob: SearchParamsType = {
    search: "test",
    order: "last-updated",
    section: "sect1",
    deprecated: false,
    nsfw: true,
    page: 1,
    includedCategories: "cat1",
    excludedCategories: "cat2",
  };

  test("returns true for identical blobs", () => {
    expect(compareSearchParamBlobs(baseBlob, { ...baseBlob })).toBe(true);
  });

  test.each(Object.keys(baseBlob) as (keyof SearchParamsType)[])(
    "returns false when %s differs",
    (key) => {
      const changedBlob: SearchParamsType = { ...baseBlob };
      if (typeof changedBlob[key] === "number") {
        (changedBlob as unknown as Record<string, number>)[key] = 999;
      } else if (typeof changedBlob[key] === "boolean") {
        const asBool = changedBlob as unknown as Record<string, boolean>;
        asBool[key] = !asBool[key];
      } else {
        (changedBlob as unknown as Record<string, string>)[key] = "CHANGED";
      }

      expect(compareSearchParamBlobs(baseBlob, changedBlob)).toBe(false);
    }
  );
});

describe("setParamsBlobCategories", () => {
  const baseBlob: SearchParamsType = {
    search: "",
    order: undefined,
    section: "",
    deprecated: false,
    nsfw: false,
    page: 1,
    includedCategories: "",
    excludedCategories: "",
  };

  test("sets included and excluded categories by joining with commas", () => {
    const setter = vi.fn();
    const categories: CategorySelection[] = [
      { id: "1", name: "", slug: "", selection: "include" },
      { id: "2", name: "", slug: "", selection: "include" },
      { id: "3", name: "", slug: "", selection: "exclude" },
      { id: "4", name: "", slug: "", selection: "off" },
    ];

    setParamsBlobCategories(setter, baseBlob, categories);

    expect(setter).toHaveBeenCalledWith({
      ...baseBlob,
      includedCategories: "1,2",
      excludedCategories: "3",
    });
  });

  test("sets empty strings when no included/excluded are selected", () => {
    const setter = vi.fn();
    const categories: CategorySelection[] = [
      { id: "1", name: "", slug: "", selection: "off" },
    ];

    // Give the baseBlob existing categories to ensure they're wiped
    const oldBlob = {
      ...baseBlob,
      includedCategories: "5",
      excludedCategories: "6",
    };

    setParamsBlobCategories(setter, oldBlob, categories);

    expect(setter).toHaveBeenCalledWith({
      ...oldBlob,
      includedCategories: "",
      excludedCategories: "",
    });
  });
});

describe("synchronizeSearchParams", () => {
  const defaultBlob: SearchParamsType = {
    search: "",
    order: undefined,
    section: "default-section",
    deprecated: false,
    nsfw: false,
    page: 1,
    includedCategories: "",
    excludedCategories: "",
  };

  const sections: Section[] = [
    {
      uuid: "default-section",
      name: "Default",
      priority: 1,
      slug: "",
    },
    {
      uuid: "other-section",
      name: "Other",
      priority: 0,
      slug: "",
    },
  ];

  test("does nothing when searchParams and blob match", () => {
    const params = new URLSearchParams();
    const result = synchronizeSearchParams(
      params,
      defaultBlob,
      defaultBlob,
      sections
    );

    expect(result).toEqual({ useReplace: false, resetPage: false, newPage: 1 });
    expect(params.toString()).toBe("");
  });

  test("updates search and sets useReplace and resetPage", () => {
    const params = new URLSearchParams();
    params.set("search", "old");
    const blob = { ...defaultBlob, search: "new-search" };

    const result = synchronizeSearchParams(params, blob, defaultBlob, sections);

    expect(result).toEqual({ useReplace: true, resetPage: true, newPage: 1 });
    expect(params.get("search")).toBe("new-search");
  });

  test("removes empty search parameter and resets page", () => {
    const params = new URLSearchParams();
    params.set("search", "old");
    const blob = { ...defaultBlob, search: "" };

    const result = synchronizeSearchParams(params, blob, defaultBlob, sections);

    expect(result).toEqual({ useReplace: true, resetPage: true, newPage: 1 });
    expect(params.has("search")).toBe(false);
  });

  test("updates ordering and resets page", () => {
    const params = new URLSearchParams();
    const blob: SearchParamsType = { ...defaultBlob, order: "top-rated" };

    const result = synchronizeSearchParams(params, blob, defaultBlob, sections);

    expect(result).toEqual({ useReplace: false, resetPage: true, newPage: 1 });
    expect(params.get("ordering")).toBe("top-rated");
  });

  test("removes ordering if it is updated/undefined and resets page", () => {
    const params = new URLSearchParams();
    params.set("ordering", "top-rated");
    const blob: SearchParamsType = { ...defaultBlob, order: "last-updated" };

    const result = synchronizeSearchParams(params, blob, defaultBlob, sections);

    expect(result).toEqual({ useReplace: false, resetPage: true, newPage: 1 });
    expect(params.has("ordering")).toBe(false);
  });

  test("updates section if not default", () => {
    const params = new URLSearchParams();
    const blob = { ...defaultBlob, section: "other-section" };

    const result = synchronizeSearchParams(params, blob, defaultBlob, sections);

    expect(result).toEqual({ useReplace: false, resetPage: true, newPage: 1 });
    expect(params.get("section")).toBe("other-section");
  });

  test("removes section if it is the default section", () => {
    const params = new URLSearchParams();
    params.set("section", "other-section");
    const blob = { ...defaultBlob, section: "default-section" };

    const result = synchronizeSearchParams(
      params,
      blob,
      { ...defaultBlob, section: "other-section" },
      sections
    );

    expect(result).toEqual({ useReplace: false, resetPage: true, newPage: 1 });
    expect(params.has("section")).toBe(false);
  });

  test("resets page if section has changed in ref", () => {
    const params = new URLSearchParams();
    params.set("section", "other-section");
    const blob = { ...defaultBlob, section: "other-section" };
    const ref = { ...defaultBlob, section: "default-section" };

    const result = synchronizeSearchParams(params, blob, ref, sections);

    expect(result.resetPage).toBe(true);
  });

  test("updates boolean properties (deprecated, nsfw)", () => {
    const params = new URLSearchParams();
    const blob = { ...defaultBlob, deprecated: true, nsfw: true };

    const result = synchronizeSearchParams(params, blob, defaultBlob, sections);

    expect(result).toEqual({ useReplace: false, resetPage: true, newPage: 1 });
    expect(params.get("deprecated")).toBe("true");
    expect(params.get("nsfw")).toBe("true");
  });

  test("removes boolean properties if false", () => {
    const params = new URLSearchParams();
    params.set("deprecated", "true");
    params.set("nsfw", "true");
    const blob = { ...defaultBlob, deprecated: false, nsfw: false };

    const result = synchronizeSearchParams(params, blob, defaultBlob, sections);

    expect(result).toEqual({ useReplace: false, resetPage: true, newPage: 1 });
    expect(params.has("deprecated")).toBe(false);
    expect(params.has("nsfw")).toBe(false);
  });

  test("updates included/excluded categories", () => {
    const params = new URLSearchParams();
    const blob = {
      ...defaultBlob,
      includedCategories: "cat1",
      excludedCategories: "cat2",
    };

    const result = synchronizeSearchParams(params, blob, defaultBlob, sections);

    expect(result).toEqual({ useReplace: false, resetPage: true, newPage: 1 });
    expect(params.get("includedCategories")).toBe("cat1");
    expect(params.get("excludedCategories")).toBe("cat2");
  });

  test("removes includedCategories if it is an empty string", () => {
    const params = new URLSearchParams();
    params.set("includedCategories", "cat1");
    const blob = { ...defaultBlob, includedCategories: "" };

    const result = synchronizeSearchParams(params, blob, defaultBlob, sections);

    expect(result).toEqual({ useReplace: false, resetPage: true, newPage: 1 });
    expect(params.has("includedCategories")).toBe(false);
  });

  test("removes excludedCategories if it is an empty string", () => {
    const params = new URLSearchParams();
    params.set("excludedCategories", "cat2");
    const blob = { ...defaultBlob, excludedCategories: "" };

    const result = synchronizeSearchParams(params, blob, defaultBlob, sections);

    expect(result).toEqual({ useReplace: false, resetPage: true, newPage: 1 });
    expect(params.has("excludedCategories")).toBe(false);
  });

  test("updates page if nothing else triggers a reset", () => {
    const params = new URLSearchParams();
    params.set("page", "1");
    const blob = { ...defaultBlob, page: 2 };

    const result = synchronizeSearchParams(params, blob, defaultBlob, sections);

    expect(result).toEqual({ useReplace: false, resetPage: false, newPage: 2 });
    expect(params.get("page")).toBe("2");
  });

  test("ignores page update and resets to 1 if another param changed", () => {
    const params = new URLSearchParams();
    params.set("page", "2");
    const blob = { ...defaultBlob, search: "new", page: 3 };

    const result = synchronizeSearchParams(params, blob, defaultBlob, sections);

    expect(result).toEqual({ useReplace: true, resetPage: true, newPage: 1 });
    expect(params.has("page")).toBe(false);
  });
});

describe("clearAll", () => {
  const baseBlob: SearchParamsType = {
    search: "test search",
    order: "last-updated",
    section: "sect1",
    deprecated: false,
    nsfw: true,
    page: 2,
    includedCategories: "cat1",
    excludedCategories: "cat2",
  };

  test("clears search and categories without changing other properties", () => {
    const setter = vi.fn();
    const clearFn = clearAll(setter, baseBlob);

    clearFn();

    expect(setter).toHaveBeenCalledWith({
      ...baseBlob,
      search: "",
      includedCategories: "",
      excludedCategories: "",
    });
  });
});
describe("resetParams", () => {
  test("resets back to initial empty searchParams state", () => {
    const setter = vi.fn();
    const sortedSections: Section[] = [
      {
        uuid: "section-X",
        name: "Sec X",
        priority: 1,
        slug: "",
      },
    ];

    resetParams(setter, "newest", sortedSections);

    expect(setter).toHaveBeenCalledWith({
      search: "",
      order: "newest",
      section: "section-X",
      deprecated: false,
      nsfw: false,
      page: 1,
      includedCategories: "",
      excludedCategories: "",
    });
  });

  test("handles empty/undefined sortedSections properly", () => {
    const setter = vi.fn();
    resetParams(setter, "newest", undefined);

    expect(setter).toHaveBeenCalledWith(
      expect.objectContaining({
        section: "",
      })
    );

    const setter2 = vi.fn();
    resetParams(setter2, "newest", []);

    expect(setter2).toHaveBeenCalledWith(
      expect.objectContaining({
        section: "",
      })
    );
  });
});
