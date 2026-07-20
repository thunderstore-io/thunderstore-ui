import * as Sentry from "@sentry/react-router";
import type { ErrorEvent } from "@sentry/react-router";
import { isRouteErrorResponse } from "react-router";

import { isApiError } from "@thunderstore/thunderstore-api";

/**
 * Decide whether a route error is expected traffic rather than a bug.
 *
 * 4xx REPORTS BY DEFAULT; suppression is an explicit allowlist of statuses
 * normal browsing produces (403/404/410: permission gates, stale links,
 * removed content; 401: see below). Everything else (400, 405, 409, 422, 429,
 * ...) reports — a bad request we built, API-contract drift, or rate limiting.
 * This applies to BOTH shapes a 4xx arrives in:
 *   - Raw ApiErrors (clientLoaders throw them unconverted).
 *   - Loader-thrown Responses (ssrLoader converts ApiErrors into Responses;
 *     the router deserializes them as ErrorResponses with `internal: false`).
 *     Without this, an SSR-side 429/400 would be blanket-suppressed.
 * Router-internal ErrorResponses (`internal: true` — 404s for unmatched URLs,
 * 405s for bad methods) are genuine bot/user noise and stay suppressed.
 *
 * 401 is expected for an anonymous user (RouteErrorBoundary redirects them to
 * login), an auth regression for a logged-in one. Only the raw-ApiError path
 * carries session context; RouteErrorBoundary resolves the session and passes
 * `anonymous`. Context-less gates (entry.client onError, entry.server
 * handleError) and loader-thrown 401s treat 401 as expected.
 *
 * Suppressed ApiErrors still leave a sampled, grouped trace — see
 * heartbeatSuppressed4xx. 5xx and non-HTTP errors always report.
 */
const SUPPRESSED_API_ERROR_STATUSES = new Set([403, 404, 410]);

export function isExpectedRouteError(
  error: unknown,
  context?: { anonymous?: boolean }
): boolean {
  if (isRouteErrorResponse(error)) {
    if (error.status >= 500) return false;
    // Loader-thrown Responses (internal:false) mirror the ApiError allowlist
    // below (+ context-less 401); router-internal 4xx (internal:true) is noise.
    if ((error as { internal?: boolean }).internal === false) {
      return (
        SUPPRESSED_API_ERROR_STATUSES.has(error.status) || error.status === 401
      );
    }
    return true;
  }
  if (isApiError(error)) {
    const status = error.response.status;
    if (SUPPRESSED_API_ERROR_STATUSES.has(status)) return true;
    if (status === 401) return context?.anonymous !== false;
    return false;
  }
  return false;
}

// ~2% of suppressed 4xx leave a trace; at that rate 20 heartbeat events/hour
// on one issue ≈ 1000 real occurrences/hour.
const HEARTBEAT_SAMPLE_RATE = 0.02;

/**
 * Sampled, grouped trace of the 4xx ApiErrors isExpectedRouteError
 * suppresses, so a storm of "expected" errors (Cloudflare serving 403s on
 * /api, a broken internal link 404ing every visitor) stays visible as a
 * frequency spike on one warning-level issue per status instead of vanishing
 * entirely. ApiErrors only — suppressed RouteErrorResponses are dominated by
 * bot noise (unmatched-URL 404s) and stay silent. Called from
 * RouteErrorBoundary only, so an error seen by several gates counts once.
 */
export function heartbeatSuppressed4xx(error: unknown): void {
  if (!isApiError(error)) return;
  if (Math.random() >= HEARTBEAT_SAMPLE_RATE) return;
  const status = String(error.response.status);
  Sentry.captureMessage(`Suppressed client 4xx: ${status}`, {
    level: "warning",
    fingerprint: ["suppressed-4xx", status],
    tags: { suppressed_status: status },
  });
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
  // ...also proxied same-origin (adblock evasion) so the host is stripped from
  // the Sentry frame; match the bare filename too.
  "ima3.js",
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

/**
 * Third-party ad scripts are proxied through our own origin, so their Sentry
 * stack frames carry host-less paths (/js/sdkloader/ima3.js, /serve/load.js,
 * /api/init-<hash>.js) that the host-based denyUrls above can't match. They
 * surface browser-internal errors that never originate in our first-party code,
 * so drop them by signature (robust to the proxy paths churning per vendor):
 *   - cross-origin frame/window access blocked by the UA (SecurityError)
 *   - Firefox XPCOM failures (NS_ERROR_*), usually with an empty message
 */
function isBrowserInternalNoise(event: ErrorEvent): boolean {
  const values = event.exception?.values ?? [];
  return values.some((v) => {
    const type = v.type ?? "";
    if (type.startsWith("NS_ERROR_")) return true;
    return (
      type === "SecurityError" &&
      /security policy|cross-origin|blocked a frame/i.test(v.value ?? "")
    );
  });
}

export function beforeSend(event: ErrorEvent): ErrorEvent | null {
  if (isAdScriptError(event)) return null;
  if (isExtensionStackOverflow(event)) return null;
  if (isBrowserInternalNoise(event)) return null;
  return event;
}
