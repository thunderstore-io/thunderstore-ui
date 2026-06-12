import * as Sentry from "@sentry/react-router";
import type { CacheControlOptions } from "cyberstorm/utils/cache";
import { cacheControl } from "cyberstorm/utils/cache";
import {
  type HeadersFunction,
  type LoaderFunctionArgs,
  data,
} from "react-router";

import { isApiError } from "@thunderstore/thunderstore-api";

interface SsrLoaderOptions {
  /** Cache options. Set to true for default CDN caching, or pass an object to customize. Defaults to false (no caching). */
  cache?: CacheControlOptions | boolean;
}

/**
 * Headers function to be exported from routes using ssrLoader with caching.
 *
 * Forwards Cache-Control headers from the loader on success. When an error
 * bubbles up (e.g. a child route throws a 5xx), prefers the error's
 * Cache-Control (no-store) to prevent CDN-caching error pages.
 *
 * @example
 * export { forwardLoaderHeaders as headers } from "cyberstorm/utils/ssrLoader";
 */
export const forwardLoaderHeaders: HeadersFunction = ({
  loaderHeaders,
  errorHeaders,
}) => {
  if (errorHeaders && errorHeaders.has("Cache-Control")) {
    return errorHeaders;
  }
  return loaderHeaders;
};

/**
 * Headers function for routes that must never be CDN-cached but render under a
 * cached parent route.
 *
 * React Router resolves document headers by walking the matched routes; a route
 * that exports no `headers` function inherits its parent's Cache-Control. A
 * non-cached child nested under a cached layout (e.g. an edit page under a
 * cached wiki layout) would therefore leak the parent's public, s-maxage
 * caching. Such routes must explicitly opt out by exporting this.
 *
 * @example
 * export { noStoreHeaders as headers } from "cyberstorm/utils/ssrLoader";
 */
export const noStoreHeaders: HeadersFunction = () => ({
  "Cache-Control": "no-store",
});

/**
 * Resolves the Cache-Control header for a thrown ApiError response.
 *
 * - 404/410 on a cacheable route are briefly CDN-cached so scrapers and bots
 *   hammering nonexistent resources are absorbed by the CDN instead of the
 *   origin. The short stale-while-revalidate window keeps newly-created
 *   resources from staying "missing" for long.
 * - Everything else (other 4xx, all 5xx, and any error on a non-cacheable
 *   route) is never stored by any cache.
 */
function errorCacheControl(
  status: number,
  cache: CacheControlOptions | boolean
): string {
  if (cache !== false && (status === 404 || status === 410)) {
    return cacheControl({ staleWhileRevalidate: 60 })["Cache-Control"];
  }
  return "no-store";
}

/**
 * Wraps react-router's SSR loader to cast ApiErrors into Response objects
 * and apply Cache-Control headers for CDN caching.
 *
 * React Router only serializes basic Error properties (message, stack) during
 * SSR hydration. Custom properties of ApiError are lost when the error is sent
 * from server to client, causing hydration mismatch errors. Convert ApiErrors
 * to Response objects to preserve all data across SSR/client boundary.
 *
 * Caching is disabled by default. Pass `cache: true` for standard CDN settings,
 * or provide a CacheControlOptions object to customize durations.
 * Routes with caching enabled must also export a `headers` function to forward
 * loader headers on document requests:
 *
 *   export { forwardLoaderHeaders as headers } from "cyberstorm/utils/ssrLoader";
 *
 * Loaders wrapped with `cache` MUST remain fully anonymous (no session/cookie
 * reads). Per-user data must be deferred to clientLoader.
 *
 * Caching also propagates DOWN the route tree: React Router resolves a matched
 * route's document headers from its own `headers` export, and a route that has
 * none inherits its parent's accumulated headers. So an uncached child route
 * under a cached parent (e.g. an editor page under a cached layout) is served
 * with the parent's public Cache-Control unless it opts out explicitly:
 *
 *   export { noStoreHeaders as headers } from "cyberstorm/utils/ssrLoader";
 *
 * @example
 * // No caching (default)
 * export const loader = ssrLoader(async ({ request }) => { ... });
 *
 * // Default CDN caching
 * export const loader = ssrLoader(async ({ request }) => { ... }, { cache: true });
 *
 * // Custom cache durations
 * export const loader = ssrLoader(async ({ request }) => { ... }, { cache: { cdnMaxAge: 60 } });
 */
export function ssrLoader<A extends LoaderFunctionArgs, T>(
  fn: (args: A) => Promise<T>,
  options?: SsrLoaderOptions
): (args: A) => Promise<T> {
  const { cache = false } = options ?? {};

  return async (args: A): Promise<T> => {
    try {
      const result = await fn(args);

      if (cache === false || result instanceof Response) {
        return result;
      }

      const cacheOptions = cache === true ? {} : cache;
      return data(result, {
        headers: cacheControl(cacheOptions),
      }) as unknown as T;
    } catch (error) {
      if (isApiError(error)) {
        const { status, statusText, url } = error.response;

        if (status >= 500) {
          let apiUrl: string;
          try {
            const parsed = new URL(url);
            apiUrl = `${parsed.host}${parsed.pathname}`;
          } catch {
            apiUrl = url;
          }
          Sentry.captureException(error, {
            tags: { apiStatus: String(status), apiUrl },
          });
        }

        // Include only handpicked attributes to avoid sensitive information
        // ending up e.g. on logs.
        const payload = { status, statusText, url };
        throw new Response(JSON.stringify(payload), {
          status,
          statusText,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": errorCacheControl(status, cache),
          },
        });
      }
      throw error;
    }
  };
}
