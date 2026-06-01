import type { Event } from "@sentry/react-router";

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
function isAdScriptError(event: Event): boolean {
  const adPatterns = denyUrls;
  const frames =
    event.exception?.values?.flatMap((v) => v.stacktrace?.frames ?? []) ?? [];

  const nonEmptyFrames = frames.filter((f) => f.filename);
  if (nonEmptyFrames.length === 0) return false;

  return nonEmptyFrames.some((frame) =>
    adPatterns.some((pattern) =>
      typeof pattern === "string"
        ? (frame.filename ?? "").includes(pattern)
        : pattern.test(frame.filename ?? "")
    )
  );
}

export function beforeSend(event: Event): Event | null {
  if (isAdScriptError(event)) return null;
  return event;
}
