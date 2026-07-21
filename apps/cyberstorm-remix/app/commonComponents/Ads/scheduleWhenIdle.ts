/**
 * Runs `callback` on the next main-thread idle period, or at `timeout` at the
 * latest, and returns a cancel function.
 *
 * Ad work (injecting ads-785.js, creating the slots) pulls in the whole auction
 * stack — GPT, prebid, Confiant, Amazon, btloader — which measured ~1.7s of
 * script execution. Starting it the instant `load` fires lands all of that on
 * top of hydration. Idle-gating lets it slot into a gap instead, and the
 * timeout bounds how long a permanently busy page may hold up the first
 * impressions.
 *
 * Safari has no requestIdleCallback; there we fall back to a short timer, which
 * is not idle-aware but still yields to the current task. That timer is capped
 * by `timeout` so the "at `timeout` at the latest" half of the contract holds
 * on both paths — otherwise a caller asking for a bound tighter than the
 * fallback delay would quietly get a later callback in Safari than elsewhere.
 */
export const IDLE_FALLBACK_DELAY_MS = 200;

export function scheduleWhenIdle(
  callback: () => void,
  timeout: number
): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  if (typeof window.requestIdleCallback === "function") {
    const handle = window.requestIdleCallback(callback, { timeout });
    return () => window.cancelIdleCallback(handle);
  }

  const delay = Math.max(0, Math.min(IDLE_FALLBACK_DELAY_MS, timeout));
  const handle = setTimeout(callback, delay);
  return () => clearTimeout(handle);
}
