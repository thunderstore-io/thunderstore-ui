// Shared route-source discovery for the SSR caching contract tests.
//
// Route source is read as raw strings via Vite so the tests run in the browser
// test environment (Node's fs is unavailable there). Discovering cached routes
// from the source — rather than a hand-maintained list — means a new
// `cache: true` route is automatically held to the same contract (must export a
// forwarding `headers`, must stay anonymous) without anyone remembering to add
// it to a list. Keyed by path relative to this file.
const routeSources = import.meta.glob("../../../app/**/*.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export interface RouteSource {
  /** App-relative path, e.g. "app/p/packageListing.tsx". */
  path: string;
  source: string;
  /** The full `ssrLoader( ... )` call expression, or null if the route has none. */
  loaderCall: string | null;
  /** True when the loader opts into caching (`cache: true` or a cache object). */
  cached: boolean;
}

/**
 * Extracts the full `ssrLoader( ... )` call expression (server loader + options)
 * by matching balanced parentheses, so callers can inspect the server loader in
 * isolation from the route's clientLoader and imports.
 */
export function extractSsrLoaderCall(source: string): string | null {
  const marker = "ssrLoader(";
  const start = source.indexOf(marker);
  if (start === -1) {
    return null;
  }
  let depth = 0;
  for (let i = start + marker.length - 1; i < source.length; i++) {
    const ch = source[i];
    if (ch === "(") depth++;
    else if (ch === ")" && --depth === 0) {
      return source.slice(start, i + 1);
    }
  }
  throw new Error("unbalanced ssrLoader( call");
}

function toRouteSource(key: string, source: string): RouteSource {
  const loaderCall = extractSsrLoaderCall(source);
  return {
    path: key.replace("../../../", ""),
    source,
    loaderCall,
    // `cache: true` or `cache: { ... }` in the ssrLoader options enables caching;
    // `cache: false` (or omitted) does not.
    cached: loaderCall !== null && /cache:\s*(true|\{)/.test(loaderCall),
  };
}

export function allRouteSources(): RouteSource[] {
  return Object.entries(routeSources)
    .map(([key, source]) => toRouteSource(key, source))
    .sort((a, b) => a.path.localeCompare(b.path));
}

export function cachedRoutes(): RouteSource[] {
  return allRouteSources().filter((r) => r.cached);
}
