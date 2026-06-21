import {
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export type OverlayScrollbarTarget =
  | { kind: "element"; ref: RefObject<HTMLElement | null> }
  | { kind: "window" };

export interface UseOverlayScrollbarOptions {
  target: OverlayScrollbarTarget;
  /** Master switch. Pass `isHydrated && isFinePointer` so the hook is inert
   *  during SSR and on touch devices. Default true. */
  enabled?: boolean;
  /** Fade-out delay after the last scroll/hover/drag activity. Default 900ms. */
  idleMs?: number;
  /** Minimum thumb length in px (a11y pointer target). Default 32. */
  minThumb?: number;
  /** Window case only: px from the right edge that reveals the thumb on hover. */
  edgeHotZone?: number;
  /** Window case only: px to inset the thumb track from the top so it clears a
   *  fixed/sticky header instead of hiding behind it. Element case insets by the
   *  scroll box's own padding automatically. Default 0. */
  topInset?: number;
}

export interface OverlayScrollbarApi {
  thumbRef: RefObject<HTMLDivElement | null>;
  visible: boolean;
  overflowing: boolean;
  onThumbPointerDown: (e: ReactPointerEvent) => void;
  /** Spread onto the thumb so hover binding survives the thumb mounting late
   *  (it only renders once `overflowing` flips true). */
  onThumbPointerEnter: () => void;
  onThumbPointerLeave: () => void;
}

interface Metrics {
  /** Visible viewport length along the scroll axis. */
  trackLength: number;
  /** Total scrollable content length. */
  scrollSize: number;
  /** Current scroll offset. */
  scrollPos: number;
}

/** Sub-pixel slack so fractional client/scroll heights (zoom, fractional DPR)
 *  don't leave a phantom 1px overflow or a thumb that never reaches bottom. */
const OVERFLOW_EPSILON = 1;

/**
 * Headless overlay-scrollbar engine for a single VERTICAL scroller — either an
 * arbitrary element or the document/window. Horizontal overflow is out of scope.
 *
 * Returns the state + handlers a thumb element needs; positions the thumb by
 * writing transform/height directly to `thumbRef` inside a coalesced rAF (no
 * per-frame React re-render). Everything that reads/writes layout lives in
 * effects, so the server renders nothing geometry-derived and there is no
 * hydration mismatch.
 */
export function useOverlayScrollbar(
  options: UseOverlayScrollbarOptions
): OverlayScrollbarApi {
  const {
    target,
    enabled = true,
    idleMs = 900,
    minThumb = 32,
    edgeHotZone = 28,
    topInset = 0,
  } = options;
  const isWindow = target.kind === "window";
  const elementRef = target.kind === "element" ? target.ref : undefined;

  const thumbRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  // Mutable state kept in refs so listeners never go stale and never re-bind.
  const rafRef = useRef<number | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoveringThumbRef = useRef(false);
  const draggingRef = useRef(false);
  // Mirror of `visible` so onScroll only triggers a re-render on the false->true
  // edge instead of every scroll tick.
  const visibleRef = useRef(false);
  const maxTravelRef = useRef(0);
  const maxScrollRef = useRef(0);
  // Drag snapshot.
  const dragStartPointerRef = useRef(0);
  const dragStartThumbTopRef = useRef(0);

  const setVisibleBoth = useCallback((next: boolean) => {
    if (visibleRef.current === next) return;
    visibleRef.current = next;
    setVisible(next);
  }, []);

  // Resolve the live scroll element + metric source for the current target.
  const readMetrics = useCallback((): Metrics | null => {
    if (isWindow) {
      if (typeof window === "undefined") return null;
      const doc = document.scrollingElement || document.documentElement;
      return {
        trackLength: window.innerHeight,
        scrollSize: doc.scrollHeight,
        scrollPos: window.scrollY,
      };
    }
    const el = elementRef?.current;
    if (!el) return null;
    return {
      trackLength: el.clientHeight,
      scrollSize: el.scrollHeight,
      scrollPos: el.scrollTop,
    };
  }, [isWindow, elementRef]);

  const setScrollPos = useCallback(
    (pos: number) => {
      // behavior:"auto" forces an INSTANT jump, overriding the global
      // `html:focus-within { scroll-behavior: smooth }` (reset.css) that would
      // otherwise make every drag step animate and lag behind the thumb.
      if (isWindow) {
        window.scrollTo({ top: pos, behavior: "auto" });
      } else if (elementRef?.current) {
        elementRef.current.scrollTo({ top: pos, behavior: "auto" });
      }
    },
    [isWindow, elementRef]
  );

  // Single source of truth: read layout + write thumb transform in one frame.
  const update = useCallback(() => {
    rafRef.current = null;
    const m = readMetrics();
    if (!m) return;
    const thumb = thumbRef.current;

    const maxScroll = m.scrollSize - m.trackLength;
    if (maxScroll <= OVERFLOW_EPSILON) {
      maxScrollRef.current = 0;
      maxTravelRef.current = 0;
      // Start hidden so a later remount (content grows back) never flashes a
      // stale is-visible thumb before the next rAF repositions it.
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      setVisibleBoth(false);
      setOverflowing(false);
      return;
    }
    setOverflowing(true);

    // Inset the visual track from the top (and bottom) so the thumb clears a
    // fixed header (window) or the scroll box's own padding (element) instead of
    // floating in the empty gap above the first item. maxTravel stays 0-based
    // within the visual track; the inset is added only to the displayed offset,
    // so the drag math (which reads maxTravelRef) is unaffected.
    let insetTop = 0;
    let insetBottom = 0;
    if (isWindow) {
      insetTop = topInset;
    } else {
      const el = elementRef?.current;
      if (el) {
        const cs = getComputedStyle(el);
        insetTop = parseFloat(cs.paddingTop) || 0;
        insetBottom = parseFloat(cs.paddingBottom) || 0;
      }
    }
    const visualTrack = Math.max(m.trackLength - insetTop - insetBottom, 0);

    const rawThumb = (m.trackLength / m.scrollSize) * visualTrack;
    const thumbLen = Math.min(Math.max(rawThumb, minThumb), visualTrack);
    const maxTravel = Math.max(visualTrack - thumbLen, 0);
    const ratio = maxScroll > 0 ? m.scrollPos / maxScroll : 0;
    const thumbTravel = Math.min(Math.max(ratio * maxTravel, 0), maxTravel);

    maxTravelRef.current = maxTravel;
    maxScrollRef.current = maxScroll;

    if (thumb) {
      thumb.style.height = `${thumbLen}px`;
      thumb.style.transform = `translate3d(0, ${insetTop + thumbTravel}px, 0)`;
    }
  }, [readMetrics, minThumb, setVisibleBoth, isWindow, elementRef, topInset]);

  const scheduleUpdate = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(update);
  }, [update]);

  // --- idle fade ---------------------------------------------------------
  const armHideTimer = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (draggingRef.current || hoveringThumbRef.current) return;
    hideTimerRef.current = setTimeout(() => setVisibleBoth(false), idleMs);
  }, [idleMs, setVisibleBoth]);

  const showThumb = useCallback(() => {
    setVisibleBoth(true);
    armHideTimer();
  }, [armHideTimer, setVisibleBoth]);

  // --- listeners ---------------------------------------------------------
  useEffect(() => {
    if (!enabled) return;

    const onScroll = () => {
      scheduleUpdate();
      showThumb();
    };

    const onResize = () => scheduleUpdate();

    // Hover reveal. Element case: pointer anywhere over the box. Window case:
    // only a hot zone near the right edge, so the bar doesn't flash on every
    // mouse twitch across the page.
    const onPointerMove = (e: PointerEvent) => {
      if (isWindow) {
        if (e.clientX >= window.innerWidth - edgeHotZone) showThumb();
      } else {
        showThumb();
      }
    };

    const scrollEventTarget: Window | HTMLElement | null = isWindow
      ? window
      : elementRef?.current ?? null;
    const moveTarget: Window | HTMLElement | null = isWindow
      ? window
      : elementRef?.current ?? null;

    scrollEventTarget?.addEventListener("scroll", onScroll, { passive: true });
    moveTarget?.addEventListener(
      "pointermove",
      onPointerMove as EventListener,
      {
        passive: true,
      }
    );
    if (isWindow)
      window.addEventListener("resize", onResize, { passive: true });

    // ResizeObserver on the box AND its content so async/expandable content
    // (CollapsibleMenu, Suspense-resolved grids, ad slots, route changes)
    // recompute thumb size even when the box itself doesn't resize.
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => scheduleUpdate());
      if (isWindow) {
        // Observe <body>: its height grows with content, so the page thumb
        // recomputes when async content (ads, Suspense, route changes) lengthens
        // the document. documentElement's box stays at viewport height and would
        // miss that growth. The thumb is position: fixed (out of flow), so this
        // can't feed back into a resize loop. Viewport resizes are covered by the
        // window "resize" listener above.
        ro.observe(document.body);
      } else if (elementRef?.current) {
        const el = elementRef.current;
        ro.observe(el);
        // Observe every element child so content-size changes from any wrapper
        // recompute the thumb — no fragile "firstElementChild is the content"
        // assumption.
        for (const child of Array.from(el.children)) {
          ro.observe(child);
        }
      }
    }

    // Lost-pointer fallbacks: if a drag is interrupted (alt-tab, context menu,
    // OS gesture) without firing pointerup/lostpointercapture, clear the drag
    // flag so auto-hide isn't suppressed forever.
    const onWindowBlur = () => {
      if (draggingRef.current) {
        draggingRef.current = false;
        document.documentElement.classList.remove("cs-scrollbar-dragging");
        armHideTimer();
      }
    };
    window.addEventListener("blur", onWindowBlur);

    // First geometry read after mount (also flips `overflowing`).
    scheduleUpdate();

    return () => {
      scrollEventTarget?.removeEventListener("scroll", onScroll);
      moveTarget?.removeEventListener(
        "pointermove",
        onPointerMove as EventListener
      );
      if (isWindow) window.removeEventListener("resize", onResize);
      window.removeEventListener("blur", onWindowBlur);
      ro?.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      rafRef.current = null;
      hideTimerRef.current = null;
      // If we unmount (or `enabled` flips false) mid-drag, pointerup never
      // fires, so clear the drag flag + drag class here. Otherwise the global
      // `user-select: none` / grabbing cursor stays stuck on <html> until reload.
      if (draggingRef.current) {
        draggingRef.current = false;
        document.documentElement.classList.remove("cs-scrollbar-dragging");
      }
    };
  }, [
    enabled,
    isWindow,
    elementRef,
    edgeHotZone,
    scheduleUpdate,
    showThumb,
    armHideTimer,
  ]);

  // The thumb only renders once `overflowing` flips true, which happens inside
  // the rAF update() — a frame where thumbRef is still null, so its geometry
  // isn't written. Re-run after the thumb has mounted so a hover-first reveal
  // (no prior scroll) shows it correctly sized instead of as a 0-height flash.
  useEffect(() => {
    if (enabled && overflowing) scheduleUpdate();
  }, [enabled, overflowing, scheduleUpdate]);

  // Hover state on the thumb itself: suspend the hide timer while hovered.
  // Wired via React props (onThumbPointerEnter/Leave) rather than manual
  // addEventListener so binding survives the thumb mounting late.
  const onThumbPointerEnter = useCallback(() => {
    hoveringThumbRef.current = true;
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setVisibleBoth(true);
  }, [setVisibleBoth]);

  const onThumbPointerLeave = useCallback(() => {
    hoveringThumbRef.current = false;
    armHideTimer();
  }, [armHideTimer]);

  // --- drag (pointer capture) -------------------------------------------
  const onThumbPointerDown = useCallback(
    (e: ReactPointerEvent) => {
      if (e.button !== 0) return;
      const thumb = thumbRef.current;
      if (!thumb) return;
      e.preventDefault();
      thumb.setPointerCapture(e.pointerId);
      draggingRef.current = true;
      dragStartPointerRef.current = e.clientY;
      // Current thumbTop derived from live scroll so the grab point stays fixed.
      const ratio =
        maxScrollRef.current > 0
          ? (readMetrics()?.scrollPos ?? 0) / maxScrollRef.current
          : 0;
      dragStartThumbTopRef.current = ratio * maxTravelRef.current;
      document.documentElement.classList.add("cs-scrollbar-dragging");
      setVisibleBoth(true);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }

      const onMove = (ev: PointerEvent) => {
        const delta = ev.clientY - dragStartPointerRef.current;
        const maxTravel = maxTravelRef.current;
        const maxScroll = maxScrollRef.current;
        if (maxTravel <= 0) return;
        const newTop = Math.min(
          Math.max(dragStartThumbTopRef.current + delta, 0),
          maxTravel
        );
        setScrollPos((newTop / maxTravel) * maxScroll);
        // The resulting scroll event drives the thumb via scheduleUpdate.
      };
      const onUp = (ev: PointerEvent) => {
        draggingRef.current = false;
        try {
          thumb.releasePointerCapture(ev.pointerId);
        } catch {
          /* capture already released */
        }
        document.documentElement.classList.remove("cs-scrollbar-dragging");
        thumb.removeEventListener("pointermove", onMove);
        thumb.removeEventListener("pointerup", onUp);
        thumb.removeEventListener("pointercancel", onUp);
        thumb.removeEventListener("lostpointercapture", onUp);
        armHideTimer();
      };
      thumb.addEventListener("pointermove", onMove);
      thumb.addEventListener("pointerup", onUp);
      thumb.addEventListener("pointercancel", onUp);
      thumb.addEventListener("lostpointercapture", onUp);
    },
    [readMetrics, setScrollPos, armHideTimer, setVisibleBoth]
  );

  return {
    thumbRef,
    visible,
    overflowing,
    onThumbPointerDown,
    onThumbPointerEnter,
    onThumbPointerLeave,
  };
}
