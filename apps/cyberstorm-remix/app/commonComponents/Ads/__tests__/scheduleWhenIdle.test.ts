import { afterEach, describe, expect, test, vi } from "vitest";

import { IDLE_FALLBACK_DELAY_MS, scheduleWhenIdle } from "../scheduleWhenIdle";

// These run in a real browser, so requestIdleCallback exists; the Safari path is
// covered by deleting it for the duration of a test. The DOM lib declares both
// as required, and `delete` rejects a non-optional property — so Omit them off
// Window before re-adding them as optional.
type IdleWindow = Omit<Window, "requestIdleCallback" | "cancelIdleCallback"> & {
  requestIdleCallback?: typeof window.requestIdleCallback;
  cancelIdleCallback?: typeof window.cancelIdleCallback;
};

const idleWindow = window as unknown as IdleWindow;
const realRequestIdleCallback = idleWindow.requestIdleCallback;
const realCancelIdleCallback = idleWindow.cancelIdleCallback;

const removeRequestIdleCallback = () => {
  delete idleWindow.requestIdleCallback;
};

afterEach(() => {
  idleWindow.requestIdleCallback = realRequestIdleCallback;
  idleWindow.cancelIdleCallback = realCancelIdleCallback;
  vi.useRealTimers();
});

describe("scheduleWhenIdle", () => {
  test("does not run the callback synchronously", () => {
    // The whole point: ad work must never land inside the caller's task.
    const callback = vi.fn();
    const cancel = scheduleWhenIdle(callback, 2000);

    expect(callback).not.toHaveBeenCalled();
    cancel();
  });

  test("runs the callback on idle", async () => {
    const callback = vi.fn();
    scheduleWhenIdle(callback, 2000);

    await vi.waitFor(() => expect(callback).toHaveBeenCalledTimes(1));
  });

  test("passes the timeout through to requestIdleCallback", () => {
    const requestIdleCallback = vi.fn(() => 1);
    idleWindow.requestIdleCallback =
      requestIdleCallback as unknown as typeof window.requestIdleCallback;
    idleWindow.cancelIdleCallback = vi.fn();

    scheduleWhenIdle(() => undefined, 2000);

    // A busy page must still load ads within a bounded window, so the timeout
    // has to reach the browser rather than being dropped.
    expect(requestIdleCallback).toHaveBeenCalledWith(expect.any(Function), {
      timeout: 2000,
    });
  });

  test("cancelling before idle prevents the callback", async () => {
    // AdsInit cancels on unmount and on React StrictMode's double-invoke; if
    // this leaked, the ad script would be injected twice.
    const callback = vi.fn();
    const cancel = scheduleWhenIdle(callback, 2000);
    cancel();

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(callback).not.toHaveBeenCalled();
  });

  describe("without requestIdleCallback (Safari)", () => {
    test("falls back to a short timer", () => {
      vi.useFakeTimers();
      removeRequestIdleCallback();
      const callback = vi.fn();

      scheduleWhenIdle(callback, 2000);
      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(IDLE_FALLBACK_DELAY_MS);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    test("cancelling clears the fallback timer", () => {
      vi.useFakeTimers();
      removeRequestIdleCallback();
      const callback = vi.fn();

      scheduleWhenIdle(callback, 2000)();

      vi.advanceTimersByTime(IDLE_FALLBACK_DELAY_MS * 10);
      expect(callback).not.toHaveBeenCalled();
    });

    test("the fallback is short, not a deferral", () => {
      // Yielding the current task is the goal; a multi-second hold would push
      // the first impression out of short visits and shift every slot refresh.
      expect(IDLE_FALLBACK_DELAY_MS).toBeLessThanOrEqual(500);
    });

    test("never runs later than the requested timeout", () => {
      // The contract promises the callback by `timeout`; a caller asking for a
      // bound tighter than the fallback delay must not get a later callback
      // here than it would where requestIdleCallback exists.
      vi.useFakeTimers();
      removeRequestIdleCallback();
      const callback = vi.fn();

      scheduleWhenIdle(callback, 50);

      vi.advanceTimersByTime(50);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    test("treats a zero or negative timeout as immediate", () => {
      vi.useFakeTimers();
      removeRequestIdleCallback();
      const callback = vi.fn();

      scheduleWhenIdle(callback, -1);

      expect(callback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(0);
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });
});
