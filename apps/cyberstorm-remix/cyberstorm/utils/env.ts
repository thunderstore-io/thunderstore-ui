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
 * Canonical absolute URL for a page, used for `og:url` and `rel=canonical`. The
 * SSR proxy terminates TLS and forwards over http, so `request.url` reports
 * `http://`; we take the origin from `VITE_SITE_URL` (per env) and only the path
 * from the request (TS-3390). Falls back to the request origin if `VITE_SITE_URL`
 * is unset/invalid. In every case we force the `https` scheme for any non-local
 * host, so a misconfigured `VITE_SITE_URL` (e.g. `http://thunderstore.dev`) can
 * never emit an insecure, redirecting canonical/og:url. `pathname` defaults to
 * the request path (query strings dropped for a stable URL).
 */
export function getCanonicalUrl(request: Request, pathname?: string): string {
  const requestUrl = new URL(request.url);
  const path = pathname ?? requestUrl.pathname;

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
