import { isRouteErrorResponse } from "react-router";

import { isRecord } from "./typeChecks";

/**
 * Marker for SSR loader errors caused by a Cloudflare challenge (TS-4045).
 * The server can never solve a challenge, but the visitor's browser often
 * can — or already has. ssrLoader tags the thrown error Response with
 * `cfChallenge: true` so RouteErrorBoundary can retry the route client-side
 * (a same-URL navigation re-runs loaders through each route's clientLoader,
 * where the user's clearance cookie applies) instead of dead-ending on an
 * error page. The 503 status keeps crawlers from treating the page as
 * permanently broken, and no-store keeps the CDN from caching it.
 */
export function isSsrChallengeResponse(error: unknown): boolean {
  return (
    isRouteErrorResponse(error) &&
    isRecord(error.data) &&
    error.data.cfChallenge === true
  );
}
