import type { ErrorEvent } from "@sentry/react-router";
import { isRouteErrorResponse } from "react-router";

/**
 * Expected 4xx route-level responses — router-internal 404s for unmatched
 * URLs (bots, typos, ACME probes), 405s for invalid methods or POSTs
 * without an action, and 4xx ApiErrors converted to Responses by
 * ssrLoader — are user/bot-facing outcomes rather than bugs and should
 * not be reported to Sentry. 5xx route errors and non-Response errors
 * are real failures and must still be captured.
 */
export function isExpectedRouteError(error: unknown): boolean {
  return isRouteErrorResponse(error) && error.status < 500;
}

// For filtering out Sentry errors based on source URL.
// Use strings for contains-style matching and regexp for more complex cases.
export const denyUrls: (string | RegExp)[] = [
  // Ad network scripts
  "btloader.com",
  "nitropay.com",
  "adnxs.com",
  "doubleclick.net",
  "googlesyndication.com",
  "googletagservices.com",
  "amazon-adsystem.com",
  "media.net",
  "confiant-integrations.net",
  "aniview.com",
  "id5-sync.com",
  "2mdn.net",
  "p7cloud.net",
  "imasdk.googleapis.com", // Google IMA SDK (ima3.js)
  "ftUtils.js", // Freestar/ad placement util, served without a stable host
  "cpx.to", // CPX survey/pixel
];

function matchesDenyUrl(text: string): boolean {
  return denyUrls.some((pattern) =>
    typeof pattern === "string" ? text.includes(pattern) : pattern.test(text)
  );
}

/**
 * Returns true when an event originates from an ad-network script.
 * Used in beforeSend to suppress ad-script errors that slip past Sentry's
 * denyUrls, including cases where ad scripts call through our XHR/fetch
 * wrappers, leaving our bundle files at the bottom of the stack trace.
 *
 * Two signals:
 * 1. Any stack frame from an ad-network origin.
 * 2. For frameless events only — cross-origin ad rejections (e.g.
 *    "NetworkError when attempting to fetch resource. (diagnostics.id5-sync.com)")
 *    carry no stack because the browser strips frames for opaque origins, so
 *    fall back to matching the ad domain in the exception message. This is
 *    gated on having no usable frames to avoid dropping a genuine app error
 *    that merely mentions an ad domain in its text.
 */
function isAdScriptError(event: ErrorEvent): boolean {
  const values = event.exception?.values ?? [];

  const namedFrames = values
    .flatMap((v) => v.stacktrace?.frames ?? [])
    .filter((f) => f.filename);

  if (namedFrames.length > 0) {
    return namedFrames.some((frame) => matchesDenyUrl(frame.filename ?? ""));
  }

  return values.some((v) => matchesDenyUrl(v.value ?? ""));
}

export function beforeSend(event: ErrorEvent): ErrorEvent | null {
  if (isAdScriptError(event)) return null;
  return event;
}
