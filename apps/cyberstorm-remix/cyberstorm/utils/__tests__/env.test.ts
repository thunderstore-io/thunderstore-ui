import { describe, expect, it, vi } from "vitest";

const ORIGIN = "https://thunderstore.io";

// Stubbed to set VITE_SITE_URL, and to keep env.ts from pulling in the
// dapper-ts CommonJS shims, which fail to load here.
const mocks = vi.hoisted(() => ({ siteUrl: "https://thunderstore.io" }));
vi.mock("cyberstorm/security/publicEnvVariables", () => ({
  getPublicEnvVariables: () => ({ VITE_SITE_URL: mocks.siteUrl }),
}));

const { getCanonicalUrl } = await import("../env");

const canonical = (url: string, pathname?: string) =>
  getCanonicalUrl(new Request(url), pathname);

describe("getCanonicalUrl", () => {
  describe("trailing slash", () => {
    it("appends the slash to a route path", () => {
      expect(canonical(`${ORIGIN}/c/how-to-fish`)).toBe(
        `${ORIGIN}/c/how-to-fish/`
      );
    });

    it("leaves an existing trailing slash alone", () => {
      expect(canonical(`${ORIGIN}/c/how-to-fish/`)).toBe(
        `${ORIGIN}/c/how-to-fish/`
      );
    });

    it("collapses both forms of a path onto one canonical", () => {
      expect(canonical(`${ORIGIN}/c/how-to-fish`)).toBe(
        canonical(`${ORIGIN}/c/how-to-fish/`)
      );
    });

    it("leaves the root path alone", () => {
      expect(canonical(`${ORIGIN}/`)).toBe(`${ORIGIN}/`);
    });

    it("does not append a slash to a file path", () => {
      expect(canonical(ORIGIN, "/cyberstorm-static/images/icon.webp")).toBe(
        `${ORIGIN}/cyberstorm-static/images/icon.webp`
      );
    });

    it("normalises an explicitly passed pathname too", () => {
      expect(canonical(`${ORIGIN}/anything`, "/communities")).toBe(
        `${ORIGIN}/communities/`
      );
    });
  });

  describe("query string", () => {
    it("keeps ?page beyond the first", () => {
      expect(canonical(`${ORIGIN}/c/how-to-fish/?page=2`)).toBe(
        `${ORIGIN}/c/how-to-fish/?page=2`
      );
    });

    it("drops ?page=1 so it does not compete with the bare URL", () => {
      expect(canonical(`${ORIGIN}/c/how-to-fish/?page=1`)).toBe(
        `${ORIGIN}/c/how-to-fish/`
      );
    });

    it("drops filter, sort and search params", () => {
      expect(
        canonical(
          `${ORIGIN}/c/how-to-fish/?section=mods&ordering=last-updated&search=fish`
        )
      ).toBe(`${ORIGIN}/c/how-to-fish/`);
    });

    it("keeps only the page when it is mixed with filters", () => {
      expect(
        canonical(`${ORIGIN}/c/how-to-fish/?section=mods&page=3&nsfw=true`)
      ).toBe(`${ORIGIN}/c/how-to-fish/?page=3`);
    });

    it.each(["abc", "1abc", "-1", "0", "1e3", "0x10", ""])(
      "drops a non-page value %o",
      (page) => {
        expect(canonical(`${ORIGIN}/c/how-to-fish/?page=${page}`)).toBe(
          `${ORIGIN}/c/how-to-fish/`
        );
      }
    );

    it("never carries a query on an explicitly passed pathname", () => {
      expect(canonical(`${ORIGIN}/c/how-to-fish/?page=2`, "/communities")).toBe(
        `${ORIGIN}/communities/`
      );
    });
  });

  it("forces https for a non-local host", () => {
    expect(canonical("http://thunderstore.io/c/how-to-fish/")).toBe(
      `${ORIGIN}/c/how-to-fish/`
    );
  });
});
