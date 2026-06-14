import { getPublicEnvVariables } from "cyberstorm/security/publicEnvVariables";
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

/**
 * Canonical absolute URL for a page, used for `og:url`. The SSR proxy terminates
 * TLS and forwards over http, so `request.url` reports `http://`; we take the
 * origin from `VITE_SITE_URL` (correct scheme per env) and only the path from the
 * request (TS-3390). Falls back to the request origin, forcing https off-localhost,
 * if `VITE_SITE_URL` is unset/invalid. `pathname` defaults to the request path
 * (query strings dropped for a stable URL).
 */
export function getCanonicalUrl(request: Request, pathname?: string): string {
  const requestUrl = new URL(request.url);
  const path = pathname ?? requestUrl.pathname;

  const { VITE_SITE_URL } = getPublicEnvVariables(["VITE_SITE_URL"]);
  if (VITE_SITE_URL) {
    try {
      return new URL(path, VITE_SITE_URL).href;
    } catch {
      // Misconfigured VITE_SITE_URL — fall through to the request-derived origin.
    }
  }

  const host = requestUrl.hostname;
  const isLocalHost =
    host === "localhost" || host === "127.0.0.1" || host.endsWith(".localhost");
  if (requestUrl.protocol === "http:" && !isLocalHost) {
    requestUrl.protocol = "https:";
  }
  return `${requestUrl.origin}${path}`;
}
