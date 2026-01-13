import { isApiError } from "@thunderstore/thunderstore-api";

/**
 * React Router only serializes basic Error properties (message, stack) during
 * SSR hydration. Custom properties of ApiError are lost when the error is sent
 * from server to client, causing hydration mismatch errors. Convert ApiErrors
 * to Response objects to preserve all data across SSR/client boundary.
 *
 * Use this to wrap Dapper methods called by SSR loaders. Do not use with
 * clientLoaders.
 */
export async function ssrSafe<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (isApiError(error)) {
      const { status, statusText, url } = error.response;

      // Only include data that's safe for logging etc.
      const payload = { status, statusText, url };

      throw new Response(JSON.stringify(payload), {
        status,
        statusText,
        headers: { "Content-Type": "application/json" },
      });
    }

    throw error;
  }
}
