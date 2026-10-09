import { describe, expect, it } from "vitest";

import { allRouteSources } from "./cachedRoutes";

// `getListingCanonicalUrl` echoes `?page=N` back into the canonical, which is
// only correct where `page` selects content. On any other route `page` is a
// no-op a crawler can pick up from anywhere, and echoing it turns
// `/settings/?page=2` into a URL of its own instead of consolidating onto
// `/settings/`. The two rules below pin both directions of that contract to the
// one marker of a paginated route: parsing the param with `parsePageParam`.
// See cyberstorm/utils/env.ts.
const PAGINATED = /parsePageParam\(/;
const LISTING_CANONICAL = /getListingCanonicalUrl\(/;
// A self-canonical: no pathname argument, so the route names its own URL.
const SELF_CANONICAL = /getCanonicalUrl\(\s*request\s*\)/;

describe("canonical page-param scope", () => {
  const routes = allRouteSources();

  it("discovers route sources", () => {
    expect(routes.length).toBeGreaterThan(0);
  });

  for (const route of routes.filter((r) => LISTING_CANONICAL.test(r.source))) {
    it(`${route.path} keeps ?page only because it paginates`, () => {
      expect(
        PAGINATED.test(route.source),
        `${route.path} uses getListingCanonicalUrl but never parses ?page, so ` +
          "the param does nothing there. Use getCanonicalUrl instead."
      ).toBe(true);
    });
  }

  for (const route of routes.filter((r) => PAGINATED.test(r.source))) {
    it(`${route.path} does not drop the page it is serving`, () => {
      expect(
        SELF_CANONICAL.test(route.source),
        `${route.path} paginates, so a bare getCanonicalUrl(request) would ` +
          "canonicalise page 2 onto page 1. Use getListingCanonicalUrl, or " +
          "pass the path this listing should consolidate onto."
      ).toBe(false);
    });
  }
});
