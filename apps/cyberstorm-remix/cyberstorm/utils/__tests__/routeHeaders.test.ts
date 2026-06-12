import { describe, expect, it } from "vitest";

// Read route source as raw strings via Vite so this works in the browser test
// environment (Node's fs is unavailable there). Keyed by path relative to this
// file, e.g. "../../../app/communities/communities.tsx".
const routeSources = import.meta.glob("../../../app/**/*.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function sourceOf(appRelativePath: string): string {
  const key = `../../../${appRelativePath}`;
  const content = routeSources[key];
  if (content === undefined) {
    throw new Error(
      `Route source not found for ${appRelativePath} (key ${key})`
    );
  }
  return content;
}

// Routes using ssrLoader with caching must forward loader headers (and prefer
// error headers) on document requests.
const cachedRouteFiles = [
  "app/communities/communities.tsx",
  "app/p/packageListing.tsx",
  "app/p/packageListingVersion.tsx",
  "app/p/dependants/Dependants.tsx",
  "app/p/tabs/Wiki/WikiFirstPage.tsx",
  "app/p/tabs/Wiki/WikiPage.tsx",
  "app/p/tabs/Wiki/Wiki.tsx",
  "app/p/tabs/Readme/PackageVersionReadme.tsx",
  "app/p/tabs/Readme/Readme.tsx",
  "app/p/tabs/Changelog/Changelog.tsx",
  "app/p/tabs/Required/Required.tsx",
  "app/p/tabs/Versions/Versions.tsx",
  "app/p/tabs/Versions/PackageVersionVersions.tsx",
  "app/c/Community.tsx",
];

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

describe("routes using ssrLoader with cache export forwardLoaderHeaders as headers", () => {
  for (const file of cachedRouteFiles) {
    it(file, () => {
      expect(sourceOf(file)).toContain(
        'export { forwardLoaderHeaders as headers } from "cyberstorm/utils/ssrLoader"'
      );
    });
  }
});

describe("non-cached routes under a cached parent export noStoreHeaders as headers", () => {
  for (const file of noStoreRouteFiles) {
    it(file, () => {
      expect(sourceOf(file)).toContain(
        'export { noStoreHeaders as headers } from "cyberstorm/utils/ssrLoader"'
      );
    });
  }
});
