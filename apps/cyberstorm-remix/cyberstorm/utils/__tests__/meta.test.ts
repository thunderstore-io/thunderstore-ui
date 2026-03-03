import type { UIMatch } from "react-router";
import { describe, expect, it } from "vitest";

import { createSeo, findMatchWithSeoInMatches } from "../meta";
import type { SeoReturn } from "../meta";

describe("meta utils", () => {
  describe("createSeo", () => {
    it("returns the input object as is", () => {
      const seo: SeoReturn = {
        descriptors: [{ title: "Test Title" }],
      };
      expect(createSeo(seo)).toBe(seo);
    });
  });

  describe("findMatchWithSeoInMatches", () => {
    it("returns undefined for empty matches", () => {
      expect(findMatchWithSeoInMatches([])).toBeUndefined();
    });

    it("returns undefined if no match has valid seo data", () => {
      const matches = [
        { data: null },
        { data: {} },
        { data: { seo: null } },
        { data: { seo: { descriptors: "invalid" } } },
      ] as UIMatch[];
      expect(findMatchWithSeoInMatches(matches)).toBeUndefined();
    });

    it("returns seo from a single match", () => {
      const seo: SeoReturn = {
        descriptors: [{ title: "Single Match" }],
      };
      const matches = [{ data: { seo } }] as UIMatch[];
      expect(findMatchWithSeoInMatches(matches)).toEqual(seo);
    });

    it("merges seo from multiple matches", () => {
      const match1 = {
        data: {
          seo: {
            descriptors: [
              { title: "First Title" },
              { name: "description", content: "First description" },
            ],
          },
        },
      };
      const match2 = {
        data: {
          seo: {
            descriptors: [
              { title: "Second Title" }, // Should override
              { name: "keywords", content: "test" }, // Should append
            ],
          },
        },
      };

      const matches = [match1, match2] as UIMatch[];
      const result = findMatchWithSeoInMatches(matches);

      expect(result).toBeDefined();
      expect(result?.descriptors).toEqual([
        { title: "Second Title" },
        { name: "description", content: "First description" },
        { name: "keywords", content: "test" },
      ]);
    });

    it("overrides properties correctly", () => {
      const match1 = {
        data: {
          seo: {
            descriptors: [{ property: "og:title", content: "Old OG Title" }],
          },
        },
      };
      const match2 = {
        data: {
          seo: {
            descriptors: [{ property: "og:title", content: "New OG Title" }],
          },
        },
      };

      const matches = [match1, match2] as UIMatch[];
      const result = findMatchWithSeoInMatches(matches);

      expect(result?.descriptors).toEqual([
        { property: "og:title", content: "New OG Title" },
      ]);
    });

    it("overrides httpEquiv correctly", () => {
      const match1 = {
        data: {
          seo: {
            descriptors: [{ httpEquiv: "refresh", content: "30" }],
          },
        },
      };
      const match2 = {
        data: {
          seo: {
            descriptors: [{ httpEquiv: "refresh", content: "5" }],
          },
        },
      };

      const matches = [match1, match2] as UIMatch[];
      const result = findMatchWithSeoInMatches(matches);

      expect(result?.descriptors).toEqual([
        { httpEquiv: "refresh", content: "5" },
      ]);
    });

    it("overrides charSet correctly", () => {
      const match1 = {
        data: {
          seo: {
            descriptors: [{ charSet: "utf-8" }],
          },
        },
      };
      const match2 = {
        data: {
          seo: {
            descriptors: [{ charSet: "utf-8" }], // same, but testing replacement logic path
          },
        },
      };

      const matches = [match1, match2] as UIMatch[];
      const result = findMatchWithSeoInMatches(matches);

      expect(result?.descriptors).toHaveLength(1);
      expect(result?.descriptors[0]).toEqual({ charSet: "utf-8" });
    });

    it("appends unknown descriptor types (like script:ld+json)", () => {
      const script1 = {
        "script:ld+json": {
          "@context": "http://localhost",
          "@type": "Organization",
        },
      };
      const script2 = {
        "script:ld+json": {
          "@context": "http://localhost",
          "@type": "Person",
        },
      };

      const match1 = {
        data: {
          seo: {
            descriptors: [script1],
          },
        },
      };
      const match2 = {
        data: {
          seo: {
            descriptors: [script2],
          },
        },
      };

      const matches = [match1, match2] as unknown as UIMatch[];
      const result = findMatchWithSeoInMatches(matches);

      // script:ld+json fall through 'else' in mergeDescriptors so they are appended
      expect(result?.descriptors).toContainEqual(script1);
      expect(result?.descriptors).toContainEqual(script2);
      expect(result?.descriptors).toHaveLength(2);
    });

    it("merges prefixes correctly", () => {
      const match1 = {
        data: { seo: { prefix: "og: http://localhost/ns#", descriptors: [] } },
      };
      const match2 = {
        data: {
          seo: { prefix: "music: http://localhost/ns#", descriptors: [] },
        },
      };
      const match3 = { data: { seo: { descriptors: [] } } }; // no prefix

      const matches = [match1, match2, match3] as UIMatch[];
      const result = findMatchWithSeoInMatches(matches);

      // The last one with a prefix should win?
      // mergeSeo: prefix: next.prefix ?? base.prefix
      // match3 has no prefix (undefined), so it keeps match2's prefix.
      expect(result?.prefix).toBe("music: http://localhost/ns#");
    });

    it("handles invalid descriptors gracefully by ignoring the entire seo object if one descriptor is invalid? No, actually isLoaderDataWithSeo returns false for the whole object", () => {
      // Logic check: isLoaderDataWithSeo iterates all descriptors. If one is invalid, it returns false.
      const match = {
        data: {
          seo: {
            descriptors: [{ title: "Valid" }, { invalid: "descriptor" }],
          },
        },
      };
      const matches = [match] as unknown as UIMatch[];
      expect(findMatchWithSeoInMatches(matches)).toBeUndefined();
    });

    it("ignores matches with invalid data shape", () => {
      const matches = [
        { data: { seo: { descriptors: [] } } }, // Valid
        { data: { seo: { descriptors: "not-array" } } }, // Invalid
        { data: { seo: "not-object" } }, // Invalid
      ] as unknown as UIMatch[];

      const result = findMatchWithSeoInMatches(matches);
      // Should pick up the first one, ignore the rest
      expect(result).toBeDefined();
      expect(result?.descriptors).toEqual([]);
    });

    it("clears prefix to empty string if specified", () => {
      const match1 = {
        data: { seo: { prefix: "Parent Prefix", descriptors: [] } },
      };
      const match2 = { data: { seo: { prefix: "", descriptors: [] } } };

      const matches = [match1, match2] as UIMatch[];
      const result = findMatchWithSeoInMatches(matches);

      expect(result?.prefix).toBe("");
    });

    it("appends descriptors that only have tagName and no collision logic like link tags", () => {
      const link1 = {
        tagName: "link",
        rel: "canonical",
        href: "http://localhost/1",
      };
      const link2 = {
        tagName: "link",
        rel: "canonical",
        href: "http://localhost/2",
      };

      const matches = [
        { data: { seo: { descriptors: [link1] } } },
        { data: { seo: { descriptors: [link2] } } },
      ] as unknown as UIMatch[];

      const result = findMatchWithSeoInMatches(matches);

      // tagName falls through to 'append' behavior
      expect(result?.descriptors).toHaveLength(2);
      expect(result?.descriptors).toContainEqual(link1);
      expect(result?.descriptors).toContainEqual(link2);
    });

    it("requires content property for name and property descriptors", () => {
      const matchInvalidName = {
        data: { seo: { descriptors: [{ name: "description" }] } },
      };
      const matchInvalidProperty = {
        data: { seo: { descriptors: [{ property: "og:title" }] } },
      };

      expect(
        findMatchWithSeoInMatches([matchInvalidName] as unknown as UIMatch[])
      ).toBeUndefined();
      expect(
        findMatchWithSeoInMatches([
          matchInvalidProperty,
        ] as unknown as UIMatch[])
      ).toBeUndefined();
    });

    it("prioritizes title update if hybrid descriptor has both title and name", () => {
      // This tests reliable merging behaviour even with weird inputs
      const hybrid = { title: "Hybrid", name: "some-name", content: "content" };
      const baseDescriptor = { title: "Original Title" };

      const matches = [
        { data: { seo: { descriptors: [baseDescriptor] } } },
        { data: { seo: { descriptors: [hybrid] } } },
      ] as unknown as UIMatch[];

      const result = findMatchWithSeoInMatches(matches);

      // Should find existing title and replace it
      expect(result?.descriptors).toHaveLength(1);
      expect(result?.descriptors[0]).toEqual(hybrid);
    });
  });
});
