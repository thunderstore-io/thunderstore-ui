import type { LoaderFunctionArgs } from "react-router";

import { isApiError } from "@thunderstore/thunderstore-api";

/**
 * Wraps react-router's SSR loader to cast ApiErrors into Response objects.
 *
 * React Router only serializes basic Error properties (message, stack) during
 * SSR hydration. Custom properties of ApiError are lost when the error is sent
 * from server to client, causing hydration mismatch errors. Convert ApiErrors
 * to Response objects to preserve all data across SSR/client boundary.
 */
export function ssrLoader<A extends LoaderFunctionArgs, T>(
  fn: (args: A) => Promise<T>
): (args: A) => Promise<T> {
  return async (args: A): Promise<T> => {
    try {
      return await fn(args);
    } catch (error) {
      if (isApiError(error)) {
        // Include only handpicked attributes to avoid sensitive information
        // ending up e.g. on logs.
        const { status, statusText, url } = error.response;
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
