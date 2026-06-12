import { describe, expect, it } from "vitest";

import { allRouteSources, cachedRoutes } from "./cachedRoutes";

const FORWARD_HEADERS_EXPORT =
  'export { forwardLoaderHeaders as headers } from "cyberstorm/utils/ssrLoader"';

const NO_STORE_HEADERS_EXPORT =
  'export { noStoreHeaders as headers } from "cyberstorm/utils/ssrLoader"';

// Auto-discovered so the contract is enforced for future routes too: a route
// that enables caching but forgets the headers export would otherwise silently
// drop the header from its document response (caching no-ops with no signal).
describe("every cached route forwards loader headers", () => {
  const routes = cachedRoutes();

  it("discovers the expected cached routes", () => {
    // Sanity check that discovery is actually finding routes; if this drops to
    // zero the per-route assertions below would vacuously pass.
    expect(routes.length).toBeGreaterThanOrEqual(14);
  });

  for (const route of routes) {
    it(route.path, () => {
      expect(route.source).toContain(FORWARD_HEADERS_EXPORT);
    });
  }
});

// Non-cached, server-rendered routes that sit under a cached parent route.
// React Router makes a route with no `headers` export inherit its parent's
// Cache-Control, so these must explicitly opt out with noStoreHeaders to avoid
// leaking the parent's public CDN caching.
const noStoreRouteFiles = [
  "app/c/tabs/PackageSearch/PackageSearch.tsx",
  "app/p/tabs/Source/Source.tsx",
  "app/p/tabs/Wiki/WikiNewPage.tsx",
  "app/p/tabs/Wiki/WikiPageEdit.tsx",
];

describe("non-cached routes under a cached parent export noStoreHeaders as headers", () => {
  const byPath = new Map(allRouteSources().map((r) => [r.path, r.source]));

  for (const file of noStoreRouteFiles) {
    it(file, () => {
      const source = byPath.get(file);
      expect(source, `route source not found for ${file}`).toBeDefined();
      expect(source).toContain(NO_STORE_HEADERS_EXPORT);
    });
  }
});
