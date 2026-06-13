export const SELECT_SEARCH_MENU_MIN_VISIBLE_PX = 120;
export const SELECT_SEARCH_MENU_SHORT_PADDING_PX = 8;

type ScrollContainerMetrics = {
  scrollTop: number;
  clientHeight: number;
  maxScrollTop: number;
  containerRect: DOMRect;
};

type ScrollTarget =
  | { kind: "element"; element: HTMLElement }
  | { kind: "window" };

export function getScrollParent(element: HTMLElement): HTMLElement | null {
  let parent = element.parentElement;

  while (parent) {
    const { overflowY } = getComputedStyle(parent);
    const isScrollable =
      overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay";

    // A scrollable overflow style with no overflowing content can't actually be
    // scrolled, so skip it and keep walking up (ultimately to the window).
    // Otherwise we'd target a non-scrolling ancestor and silently do nothing.
    if (isScrollable && parent.scrollHeight > parent.clientHeight) {
      return parent;
    }

    parent = parent.parentElement;
  }

  return null;
}

function getElementScrollMetrics(element: HTMLElement): ScrollContainerMetrics {
  const clientHeight = element.clientHeight;

  return {
    scrollTop: element.scrollTop,
    clientHeight,
    maxScrollTop: Math.max(0, element.scrollHeight - clientHeight),
    containerRect: element.getBoundingClientRect(),
  };
}

function getWindowScrollMetrics(): ScrollContainerMetrics {
  const clientHeight = document.documentElement.clientHeight;

  return {
    scrollTop: window.scrollY,
    clientHeight,
    maxScrollTop: Math.max(
      0,
      document.documentElement.scrollHeight - clientHeight
    ),
    containerRect: new DOMRect(
      0,
      0,
      document.documentElement.clientWidth,
      clientHeight
    ),
  };
}

function resolveScrollTarget(
  container: HTMLElement,
  scrollContainerSelector?: string
): ScrollTarget | null {
  if (scrollContainerSelector) {
    const element = container.closest(scrollContainerSelector);
    if (!(element instanceof HTMLElement)) {
      return null;
    }

    return { kind: "element", element };
  }

  const scrollParent = getScrollParent(container);
  if (scrollParent) {
    return { kind: "element", element: scrollParent };
  }

  return { kind: "window" };
}

export function getMenuTargetScrollTop(
  metrics: ScrollContainerMetrics,
  menuRect: DOMRect,
  {
    minVisiblePx = SELECT_SEARCH_MENU_MIN_VISIBLE_PX,
    shortMenuPaddingPx = SELECT_SEARCH_MENU_SHORT_PADDING_PX,
  }: {
    minVisiblePx?: number;
    shortMenuPaddingPx?: number;
  } = {}
): number | null {
  const { scrollTop, clientHeight, maxScrollTop, containerRect } = metrics;
  const isShortMenu = menuRect.height < minVisiblePx;
  const targetVisible = isShortMenu
    ? menuRect.height + shortMenuPaddingPx
    : minVisiblePx;

  const menuTop = menuRect.top - containerRect.top + scrollTop;
  const menuBottom = menuRect.bottom - containerRect.top + scrollTop;
  const visibleBottomBound = isShortMenu
    ? menuBottom + shortMenuPaddingPx
    : menuBottom;

  const visibleHeightAt = (nextScrollTop: number) => {
    const visibleTop = Math.max(menuTop, nextScrollTop);
    const visibleBottom = Math.min(
      visibleBottomBound,
      nextScrollTop + clientHeight
    );

    return Math.max(0, visibleBottom - visibleTop);
  };

  if (visibleHeightAt(scrollTop) >= targetVisible) {
    return null;
  }

  const clamp = (value: number) => Math.max(0, Math.min(value, maxScrollTop));

  // The viewport is shorter than the height we want visible, so no scroll
  // position can reach the target. Show as much as possible by aligning the
  // menu's top to the viewport top — but only if that actually improves things.
  if (targetVisible > clientHeight) {
    const bestEffort = clamp(menuTop);
    return visibleHeightAt(bestEffort) > visibleHeightAt(scrollTop)
      ? bestEffort
      : null;
  }

  // visibleHeightAt() is piecewise-linear, so the scrollTop that first reaches
  // targetVisible is closed-form — no scanning. Scroll down to bring the menu's
  // bottom into view, or up to bring its top into view; prefer down. The
  // visibleHeightAt() guards keep this correct under clamping/edge geometry.
  const scrollDownTarget = clamp(menuTop + targetVisible - clientHeight);
  if (
    scrollDownTarget > scrollTop &&
    visibleHeightAt(scrollDownTarget) >= targetVisible
  ) {
    return scrollDownTarget;
  }

  const scrollUpTarget = clamp(visibleBottomBound - targetVisible);
  if (
    scrollUpTarget < scrollTop &&
    visibleHeightAt(scrollUpTarget) >= targetVisible
  ) {
    return scrollUpTarget;
  }

  return null;
}

function scrollToTarget(
  target: ScrollTarget,
  top: number,
  behavior: ScrollBehavior
) {
  if (target.kind === "element") {
    target.element.scrollTo({ top, behavior });
    return;
  }

  window.scrollTo({ top, behavior });
}

export function scrollMenuIntoScrollParent(
  container: HTMLElement,
  {
    scrollContainerSelector,
    minVisiblePx,
    shortMenuPaddingPx,
    behavior = "smooth",
  }: {
    scrollContainerSelector?: string;
    minVisiblePx?: number;
    shortMenuPaddingPx?: number;
    behavior?: ScrollBehavior;
  } = {}
): boolean {
  const menu = container.querySelector(".select-search__menu");
  if (!(menu instanceof HTMLElement)) {
    return false;
  }

  const scrollTarget = resolveScrollTarget(container, scrollContainerSelector);
  if (!scrollTarget) {
    return false;
  }

  const metrics =
    scrollTarget.kind === "element"
      ? getElementScrollMetrics(scrollTarget.element)
      : getWindowScrollMetrics();

  const targetScrollTop = getMenuTargetScrollTop(
    metrics,
    menu.getBoundingClientRect(),
    { minVisiblePx, shortMenuPaddingPx }
  );

  // No scroll needed (already visible, or nothing better is reachable). Report
  // it as "not scrolled" so the hook keeps its post-layout retry rather than
  // treating an early "already visible" reading as done.
  if (targetScrollTop === null) {
    return false;
  }

  scrollToTarget(scrollTarget, targetScrollTop, behavior);
  return true;
}
