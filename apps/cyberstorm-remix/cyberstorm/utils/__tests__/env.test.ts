import { describe, expect, it, vi } from "vitest";

const ORIGIN = "https://thunderstore.io";

// Stubbed to set VITE_SITE_URL, and to keep env.ts from pulling in the
// dapper-ts CommonJS shims, which fail to load here.
const mocks = vi.hoisted(() => ({ siteUrl: "https://thunderstore.io" }));
vi.mock("cyberstorm/security/publicEnvVariables", () => ({
  getPublicEnvVariables: () => ({ VITE_SITE_URL: mocks.siteUrl }),
}));

const { getAssetUrl, getCanonicalUrl, getListingCanonicalUrl } = await import(
  "../env"
);

const canonical = (url: string, pathname?: string) =>
  getCanonicalUrl(new Request(url), pathname);

const listingCanonical = (url: string, pathname?: string) =>
  getListingCanonicalUrl(new Request(url), pathname);

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

    // A dot is not the mark of a file: a version page's path ends in the
    // version number. Every path a canonical is asked for is a route, and gets
    // a slash; a file is fetched through getAssetUrl instead.
    it("appends the slash to a path with a dot in it", () => {
      expect(canonical(`${ORIGIN}/c/how-to-fish/p/ebkr/r2modman/v/1.2.0`)).toBe(
        `${ORIGIN}/c/how-to-fish/p/ebkr/r2modman/v/1.2.0/`
      );
    });

    it("normalises an explicitly passed pathname too", () => {
      expect(canonical(`${ORIGIN}/anything`, "/communities")).toBe(
        `${ORIGIN}/communities/`
      );
    });
  });

  describe("query string", () => {
    it("drops filter, sort and search params", () => {
      expect(
        canonical(
          `${ORIGIN}/c/how-to-fish/?section=mods&ordering=last-updated&search=fish`
        )
      ).toBe(`${ORIGIN}/c/how-to-fish/`);
    });

    // `page` selects content only on a listing route. Everywhere else it is a
    // no-op the crawler may have picked up from anywhere, so the page has to
    // consolidate onto its bare path rather than self-canonicalise.
    it("drops ?page, which only a listing canonical keeps", () => {
      expect(canonical(`${ORIGIN}/settings/?page=2`)).toBe(
        `${ORIGIN}/settings/`
      );
    });

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

describe("getListingCanonicalUrl", () => {
  it("keeps ?page beyond the first", () => {
    expect(listingCanonical(`${ORIGIN}/c/how-to-fish/?page=2`)).toBe(
      `${ORIGIN}/c/how-to-fish/?page=2`
    );
  });

  it("drops ?page=1 so it does not compete with the bare URL", () => {
    expect(listingCanonical(`${ORIGIN}/c/how-to-fish/?page=1`)).toBe(
      `${ORIGIN}/c/how-to-fish/`
    );
  });

  it("keeps only the page when it is mixed with filters", () => {
    expect(
      listingCanonical(`${ORIGIN}/c/how-to-fish/?section=mods&page=3&nsfw=true`)
    ).toBe(`${ORIGIN}/c/how-to-fish/?page=3`);
  });

  it.each(["abc", "1abc", "-1", "0", "1e3", "0x10", ""])(
    "drops a non-page value %o",
    (page) => {
      expect(listingCanonical(`${ORIGIN}/c/how-to-fish/?page=${page}`)).toBe(
        `${ORIGIN}/c/how-to-fish/`
      );
    }
  );

  // The loaders parse ?page with parsePageParam, which serves page 1 here.
  it("drops a page past the safe-integer range", () => {
    expect(
      listingCanonical(`${ORIGIN}/c/how-to-fish/?page=99999999999999999999`)
    ).toBe(`${ORIGIN}/c/how-to-fish/`);
  });

  it("keeps a whitespace-padded page, which the loaders accept", () => {
    expect(listingCanonical(`${ORIGIN}/c/how-to-fish/?page=%202%20`)).toBe(
      `${ORIGIN}/c/how-to-fish/?page=2`
    );
  });

  it("normalises the trailing slash before the page", () => {
    expect(listingCanonical(`${ORIGIN}/c/how-to-fish?page=2`)).toBe(
      `${ORIGIN}/c/how-to-fish/?page=2`
    );
  });

  it("keeps the page on an explicitly passed pathname", () => {
    expect(
      listingCanonical(`${ORIGIN}/c/how-to-fish?page=2`, "/c/how-to-fish/")
    ).toBe(`${ORIGIN}/c/how-to-fish/?page=2`);
  });
});

describe("getAssetUrl", () => {
  const asset = (url: string, pathname: string) =>
    getAssetUrl(new Request(url), pathname);

  it("keeps a file path exactly as given", () => {
    expect(asset(ORIGIN, "/cyberstorm-static/images/icon.webp")).toBe(
      `${ORIGIN}/cyberstorm-static/images/icon.webp`
    );
  });

  it("takes the origin from the environment, like a canonical", () => {
    expect(asset("http://thunderstore.localhost/anything", "/icon.webp")).toBe(
      `${ORIGIN}/icon.webp`
    );
  });

  it("forces https for a non-local host", () => {
    expect(asset("http://thunderstore.io/x", "/icon.webp")).toBe(
      `${ORIGIN}/icon.webp`
    );
  });
});
