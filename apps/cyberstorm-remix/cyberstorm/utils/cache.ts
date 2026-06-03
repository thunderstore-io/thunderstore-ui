export interface CacheControlOptions {
  browserMaxAge?: number;
  cdnMaxAge?: number;
  staleWhileRevalidate?: number;
  isPrivate?: boolean;
}

/**
 * Creates a Cache-Control header object for CDN and browser caching.
 *
 * @param options.browserMaxAge - How long browsers cache the response (seconds). Default: 60 (1 min)
 * @param options.cdnMaxAge - How long the CDN caches the response (seconds). Default: 300 (5 min)
 * @param options.staleWhileRevalidate - How long the CDN can serve stale content while
 *   fetching a fresh response in the background (seconds). Default: 600 (10 min)
 * @param options.isPrivate - If true, prevents CDN caching (e.g. for authenticated responses). Default: false
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
    return { "Cache-Control": `private, max-age=${browserMaxAge}, no-store` };
  }

  return {
    "Cache-Control": [
      "public",
      `max-age=${browserMaxAge}`,
      `s-maxage=${cdnMaxAge}`,
      `stale-while-revalidate=${staleWhileRevalidate}`,
    ].join(", "),
  };
}
