import * as Sentry from "@sentry/react-router";
import type { CacheControlOptions } from "cyberstorm/utils/cache";
import { cacheControl } from "cyberstorm/utils/cache";
import { type LoaderFunctionArgs, data } from "react-router";

import { isApiError } from "@thunderstore/thunderstore-api";

interface SsrLoaderOptions {
  /** Cache options. Set to true for default CDN caching, or pass an object to customize. Defaults to false (no caching). */
  cache?: CacheControlOptions | boolean;
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
 *   export const headers: Route.HeadersFunction = ({ loaderHeaders }) => loaderHeaders;
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
          headers: { "Content-Type": "application/json" },
        });
      }
      throw error;
    }
  };
}
