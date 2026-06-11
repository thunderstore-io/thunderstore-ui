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
];

/**
 * Returns true when any stack frame comes from an ad-network origin.
 * Used in beforeSend to suppress ad-script errors that slip past denyUrls,
 * including cases where ad scripts call through our XHR/fetch wrappers,
 * leaving our bundle files at the bottom of the stack trace.
 */
function isAdScriptError(event: ErrorEvent): boolean {
  const frames =
    event.exception?.values?.flatMap((v) => v.stacktrace?.frames ?? []) ?? [];

  const nonEmptyFrames = frames.filter((f) => f.filename);
  if (nonEmptyFrames.length === 0) return false;

  return nonEmptyFrames.some((frame) =>
    denyUrls.some((pattern) =>
      typeof pattern === "string"
        ? (frame.filename ?? "").includes(pattern)
        : pattern.test(frame.filename ?? "")
    )
  );
}

export function beforeSend(event: ErrorEvent): ErrorEvent | null {
  if (isAdScriptError(event)) return null;
  return event;
}
