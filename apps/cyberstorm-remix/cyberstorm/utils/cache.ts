export interface CacheControlOptions {
  browserMaxAge?: number;
  cdnMaxAge?: number;
  staleWhileRevalidate?: number;
  isPrivate?: boolean;
}

// Cache-Control delta-seconds must be a non-negative integer (RFC 7234), so
// clamp custom inputs to keep the emitted directive well-formed for any caller.
function deltaSeconds(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

/**
 * Creates a Cache-Control header object for CDN and browser caching.
 *
 * Produces one of two directive sets:
 * - Public (default): `public, max-age, s-maxage, stale-while-revalidate` —
 *   honored by both shared (CDN) and private (browser) caches.
 * - Private (`isPrivate: true`): `private, max-age` only. `cdnMaxAge` and
 *   `staleWhileRevalidate` are intentionally dropped here — `s-maxage` is a
 *   shared-cache directive, and we don't emit SWR on private responses (per
 *   RFC 5861 it would be valid for private caches too, if ever wanted).
 *
 * @param options.browserMaxAge - `max-age`: how long any cache may reuse the
 *   response without revalidating (seconds). Default: 60 (1 min)
 * @param options.cdnMaxAge - `s-maxage`: shared-cache (CDN) freshness lifetime.
 *   Public branch only (seconds). Default: 300 (5 min)
 * @param options.staleWhileRevalidate - `stale-while-revalidate`: how long a
 *   cache may serve stale content while revalidating in the background. Public
 *   branch only. On a public response this also applies to browser caches, so
 *   the effective browser staleness ceiling is `browserMaxAge +
 *   staleWhileRevalidate` (660s with defaults), not `browserMaxAge` (seconds).
 *   Default: 600 (10 min)
 * @param options.isPrivate - If true, prevents shared/CDN caching (e.g. for
 *   authenticated responses). Default: false
 */
export function cacheControl(options?: CacheControlOptions): {
  "Cache-Control": string;
} {
  const {
    browserMaxAge = 60,
    cdnMaxAge = 300,
    staleWhileRevalidate = 600,
    isPrivate = false,
  } = options ?? {};

  if (isPrivate) {
    return {
      "Cache-Control": `private, max-age=${deltaSeconds(browserMaxAge)}`,
    };
  }

  return {
    "Cache-Control": [
      "public",
      `max-age=${deltaSeconds(browserMaxAge)}`,
      `s-maxage=${deltaSeconds(cdnMaxAge)}`,
      `stale-while-revalidate=${deltaSeconds(staleWhileRevalidate)}`,
    ].join(", "),
  };
}
