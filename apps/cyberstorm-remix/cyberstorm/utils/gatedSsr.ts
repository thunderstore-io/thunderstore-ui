import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { data } from "react-router";

import { isRecord } from "./typeChecks";

/**
 * Helpers for routes whose content may be hidden from anonymous requests
 * but visible to a logged-in user with sufficient permissions (e.g.
 * unlisted or review-queue package listings).
 *
 * SSR loaders run anonymously by design: their responses may be cached
 * and must never contain user-specific data. When the anonymous API
 * request 404s, the SSR loader cannot tell whether the content truly
 * doesn't exist or is merely hidden from anonymous users. Throwing in
 * the SSR loader would lock the route into its ErrorBoundary — React
 * Router never runs a clientLoader on hydration for a route whose
 * server loader errored — so a permitted user entering the URL directly
 * would be stuck on a 404 page.
 *
 * Instead the SSR loader *returns* a sentinel marked with a 404 response
 * status (so crawlers and other anonymous direct entries still get a
 * proper 404 document). The route's clientLoader (with hydrate = true)
 * then resolves the sentinel on hydration:
 * - without a session cookie it becomes a real 404, thrown without any
 *   extra API requests
 * - with a session cookie the data is re-fetched with the session id
 *   attached, surfacing the content or an appropriate error
 */

export type GatedSsrSentinel = { __gatedSsr404: true };

/**
 * Marks an SSR loader result as "not visible to anonymous requests" with
 * a 404 response status. Pass the route's loader data shape filled with
 * empty values so the component can render a placeholder until the
 * clientLoader resolves.
 */
export function gatedSsr404<T extends object>(emptyData: T) {
  return data({ ...emptyData, __gatedSsr404: true as const }, { status: 404 });
}

export function isGatedSsrData(value: unknown): value is GatedSsrSentinel {
  return isRecord(value) && value.__gatedSsr404 === true;
}

/**
 * Client-only check for whether a session cookie is present. clientLoaders
 * use this to avoid sending session-dependent requests for anonymous
 * users; it does not validate the session, only its presence.
 */
export function hasSessionCookie(): boolean {
  return Boolean(getSessionTools().getConfig().sessionId);
}
