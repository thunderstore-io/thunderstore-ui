import React from "react";

import { scrollMenuIntoScrollParent } from "./scrollMenuIntoScrollParent";

type UseScrollMenuIntoScrollParentOptions = {
  containerRef: React.RefObject<HTMLElement | null>;
  isVisible: boolean;
  enabled?: boolean;
  scrollContainerSelector?: string;
  minVisiblePx?: number;
  shortMenuPaddingPx?: number;
};

export function useScrollMenuIntoScrollParent({
  containerRef,
  isVisible,
  enabled = true,
  scrollContainerSelector,
  minVisiblePx,
  shortMenuPaddingPx,
}: UseScrollMenuIntoScrollParentOptions) {
  React.useEffect(() => {
    if (!isVisible || !enabled) {
      return;
    }

    let cancelled = false;
    let scrollStarted = false;
    const timeoutIds: number[] = [];
    const rafIds: number[] = [];

    const runScroll = () => {
      if (cancelled || scrollStarted) {
        return;
      }

      const container = containerRef.current;
      if (!container) {
        return;
      }

      const didScroll = scrollMenuIntoScrollParent(container, {
        scrollContainerSelector,
        minVisiblePx,
        shortMenuPaddingPx,
      });

      if (didScroll) {
        scrollStarted = true;
      }
    };

    // Wait two frames so the menu is laid out (and measurable) before we read
    // its geometry; the 100ms retry covers menus whose size settles late (async
    // content, fonts, transitions).
    const scheduleScroll = () => {
      rafIds.push(
        requestAnimationFrame(() => {
          rafIds.push(requestAnimationFrame(runScroll));
        })
      );
    };

    scheduleScroll();
    timeoutIds.push(window.setTimeout(scheduleScroll, 100));

    return () => {
      cancelled = true;
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      rafIds.forEach((rafId) => cancelAnimationFrame(rafId));
    };
  }, [
    containerRef,
    enabled,
    isVisible,
    minVisiblePx,
    scrollContainerSelector,
    shortMenuPaddingPx,
  ]);
}
