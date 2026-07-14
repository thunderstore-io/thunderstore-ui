import type { ErrorEvent } from "@sentry/react-router";
import { isRouteErrorResponse } from "react-router";

import { isApiError } from "@thunderstore/thunderstore-api";

/**
 * Expected 4xx errors — router-internal 404s for unmatched URLs (bots,
 * typos, ACME probes), 405s for invalid methods or POSTs without an action,
 * and 4xx ApiErrors converted to Responses by ssrLoader — are user/bot-facing
 * outcomes rather than bugs and should not be reported to Sentry. 5xx errors
 * and non-HTTP errors are real failures and must still be captured.
 *
 * clientLoaders throw ApiError directly (it is not converted to a Response on
 * the client), so 4xx ApiErrors — 401/403/404/429, e.g. a Cloudflare 403 on a
 * deep listing page — are matched here too, not just thrown Responses.
 */
export function isExpectedRouteError(error: unknown): boolean {
  if (isRouteErrorResponse(error)) return error.status < 500;
  if (isApiError(error)) {
    return error.response.status >= 400 && error.response.status < 500;
  }
  return false;
}

/**
 * react-router serializes loader-thrown Responses into ErrorResponse *objects*
 * ({ status, statusText, internal, data }), not Error instances. Passing one
 * straight to Sentry.captureException yields a useless "Object captured as
 * exception with keys: data, internal, status, statusText" event — no message,
 * and every route response lumped into one group. Wrap it in a real Error so
 * the (only 5xx, after isExpectedRouteError) route errors group by status and
 * read clearly.
 *
 * For internal errors (a loader/action that threw a non-Response Error), the
 * router keeps the original Error it caught on the response's `.error` field.
 * Adopt that Error's stack — and keep it as `cause` — so Sentry points at the
 * real failure site instead of this wrapper; the name/message we set still
 * drive grouping. ApiError and plain Errors already carry a message + stack, so
 * they pass through unchanged.
 */
export function toReportableError(error: unknown): unknown {
  if (isRouteErrorResponse(error)) {
    const reportable = new Error(
      `RouteErrorResponse ${error.status} ${error.statusText}`.trim()
    );
    reportable.name = "RouteErrorResponse";
    // `.error` isn't on the public ErrorResponse type but is present at runtime
    // for internal errors (react-router's ErrorResponseImpl stores the caught
    // Error there).
    const original = (error as { error?: unknown }).error;
    if (original instanceof Error) {
      if (original.stack) {
        reportable.stack = original.stack;
      }
      (reportable as { cause?: unknown }).cause = original;
    }
    return reportable;
  }
  return error;
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
 * A stack frame only attributes an error to a real script if it has a concrete
 * filename. Browser extensions and opaque cross-origin scripts surface as
 * anonymous (or filename-less) frames, so they don't count as "usable" — both
 * the ad-script and stack-overflow checks fall back to other signals when every
 * frame is anonymous.
 */
function hasUsableFilename(frame: { filename?: string }): boolean {
  const filename = frame.filename ?? "";
  return filename !== "" && filename !== "<anonymous>";
}

/**
 * Returns true when an event originates from an ad-network script.
 * Used in beforeSend to suppress ad-script errors that slip past Sentry's
 * denyUrls, including cases where ad scripts call through our XHR/fetch
 * wrappers, leaving our bundle files at the bottom of the stack trace.
 *
 * Two signals:
 * 1. Any stack frame from an ad-network origin.
 * 2. When no frame has a usable filename (all anonymous/native, e.g. opaque
 *    cross-origin ad rejections like "NetworkError when attempting to fetch
 *    resource. (diagnostics.id5-sync.com)" whose frames the browser strips) —
 *    fall back to matching the ad domain in the exception message. Gated on
 *    having no usable frames so a genuine app error that merely mentions an ad
 *    domain in its text, but has a real stack, is still captured.
 */
function isAdScriptError(event: ErrorEvent): boolean {
  const values = event.exception?.values ?? [];

  const namedFrames = values
    .flatMap((v) => v.stacktrace?.frames ?? [])
    .filter(hasUsableFilename);

  if (namedFrames.length > 0) {
    return namedFrames.some((frame) => matchesDenyUrl(frame.filename ?? ""));
  }

  return values.some((v) => matchesDenyUrl(v.value ?? ""));
}

/**
 * Browser extensions (anti-fingerprinting, ad blockers, page translators)
 * install recursive getOwnPropertyDescriptor / Proxy traps that overflow the
 * stack entirely within their own injected code: the event is a "Maximum call
 * stack size exceeded" RangeError whose frames are all anonymous with no
 * filename. Drop those. A genuine recursion in our code leaves our bundle on
 * the stack (a frame with a real filename), so it is still captured.
 */
function isExtensionStackOverflow(event: ErrorEvent): boolean {
  const values = event.exception?.values ?? [];

  const isStackOverflow = values.some(
    (v) =>
      v.type === "RangeError" &&
      (v.value ?? "").includes("Maximum call stack size exceeded")
  );
  if (!isStackOverflow) return false;

  const hasOwnCodeFrame = values
    .flatMap((v) => v.stacktrace?.frames ?? [])
    .some(hasUsableFilename);

  return !hasOwnCodeFrame;
}

export function beforeSend(event: ErrorEvent): ErrorEvent | null {
  if (isAdScriptError(event)) return null;
  if (isExtensionStackOverflow(event)) return null;
  return event;
}
