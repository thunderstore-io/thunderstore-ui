import { getPublicEnvVariables } from "cyberstorm/security/publicEnvVariables";
import { parsePageParam } from "cyberstorm/utils/searchParamsUtils";
import { isRecord } from "cyberstorm/utils/typeChecks";

/**
 *
 * @returns host address for Thunderstore API.
 * @throws if non-empty URL is not defined in the environment variables.
 *         Throws a Response object which gets handled by the error boundary.
 */
export function getApiHostForSsr(): string {
  let apiHost: string | undefined;

  if (isRecord(process.env)) {
    apiHost = process.env?.VITE_API_URL;
  }

  if (!apiHost) {
    throw new Response(null, {
      status: 500,
      statusText: "API URL not configured",
      headers: { "Content-Type": "application/json" },
    });
  }

  return apiHost;
}

// Both slash forms answer 200, so one has to be picked.
function withTrailingSlash(path: string): string {
  return path.endsWith("/") ? path : `${path}/`;
}

// The one URL for a package. Use as the `og:url` of its tabs and version
// pages so they consolidate onto the listing.
export function packageCanonicalPath(
  communityId: string,
  namespaceId: string,
  packageId: string
): string {
  return `/c/${communityId}/p/${namespaceId}/${packageId}/`;
}

// `?page=N` for N above 1, nothing else. Page 1 stays bare so it keeps one URL.
// Parsed the way the loaders parse it, so the canonical names the page served.
function canonicalQuery(requestUrl: URL): string {
  const page = parsePageParam(requestUrl.searchParams.get("page"));
  return page !== undefined && page > 1 ? `?page=${page}` : "";
}

function canonicalUrl(
  request: Request,
  pathname: string | undefined,
  keepPage: boolean
): string {
  const requestUrl = new URL(request.url);
  const basePath = withTrailingSlash(pathname ?? requestUrl.pathname);
  const path = keepPage ? `${basePath}${canonicalQuery(requestUrl)}` : basePath;
  return absoluteUrl(request, path);
}

function absoluteUrl(request: Request, path: string): string {
  const requestUrl = new URL(request.url);

  let resolved: URL | undefined;
  const { VITE_SITE_URL } = getPublicEnvVariables(["VITE_SITE_URL"]);
  if (VITE_SITE_URL) {
    try {
      resolved = new URL(path, VITE_SITE_URL);
    } catch {
      // Misconfigured VITE_SITE_URL — fall through to the request-derived origin.
    }
  }
  if (!resolved) {
    resolved = new URL(path, requestUrl.origin);
  }

  const host = resolved.hostname;
  const isLocalHost =
    host === "localhost" || host === "127.0.0.1" || host.endsWith(".localhost");
  if (resolved.protocol === "http:" && !isLocalHost) {
    resolved.protocol = "https:";
  }
  return resolved.href;
}

/**
 * Canonical absolute URL for a page, used for `og:url` and `rel=canonical`. The
 * SSR proxy terminates TLS and forwards over http, so `request.url` reports
 * `http://`; we take the origin from `VITE_SITE_URL` (per env) and only the path
 * from the request (TS-3390). Falls back to the request origin if `VITE_SITE_URL`
 * is unset/invalid. In every case we force the `https` scheme for any non-local
 * host, so a misconfigured `VITE_SITE_URL` (e.g. `http://thunderstore.dev`) can
 * never emit an insecure, redirecting canonical/og:url. `pathname` defaults to
 * the request path.
 *
 * The query string is dropped, so every filtered, sorted and searched view of a
 * page consolidates onto one URL. Paginated listings are the exception and use
 * `getListingCanonicalUrl`.
 */
export function getCanonicalUrl(request: Request, pathname?: string): string {
  return canonicalUrl(request, pathname, false);
}

/**
 * Absolute URL for a static file, such as an og:image. Shares the origin and
 * scheme handling with `getCanonicalUrl` and keeps the path exactly as given:
 * an asset is a file, and a trailing slash would not resolve to it. Saying so
 * at the call site is what lets the canonical helpers slash every path they are
 * given, rather than guessing from a dot in the last segment, which a route can
 * have too: a version page's ends in the version number.
 */
export function getAssetUrl(request: Request, pathname: string): string {
  return absoluteUrl(request, pathname);
}

/**
 * `getCanonicalUrl` for a paginated listing: keeps `?page=N` for N above 1, so
 * page 2 stays self-canonical instead of collapsing into page 1.
 *
 * Only a route whose `page` param selects content may use this. Everywhere else
 * `page` does nothing, and echoing it would turn `/settings/?page=2` into a URL
 * of its own instead of consolidating onto `/settings/`.
 */
export function getListingCanonicalUrl(
  request: Request,
  pathname?: string
): string {
  return canonicalUrl(request, pathname, true);
}
