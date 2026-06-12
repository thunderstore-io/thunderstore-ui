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

    if (
      overflowY === "auto" ||
      overflowY === "scroll" ||
      overflowY === "overlay"
    ) {
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

  for (
    let candidateScrollTop = scrollTop + 1;
    candidateScrollTop <= maxScrollTop;
    candidateScrollTop++
  ) {
    if (visibleHeightAt(candidateScrollTop) >= targetVisible) {
      return candidateScrollTop;
    }
  }

  for (
    let candidateScrollTop = scrollTop - 1;
    candidateScrollTop >= 0;
    candidateScrollTop--
  ) {
    if (visibleHeightAt(candidateScrollTop) >= targetVisible) {
      return candidateScrollTop;
    }
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

  if (targetScrollTop === null) {
    return true;
  }

  scrollToTarget(scrollTarget, targetScrollTop, behavior);
  return true;
}
