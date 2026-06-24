import { type ReactNode, memo, useEffect, useState } from "react";

import "./OverlayScrollbar.css";
import {
  type OverlayScrollbarApi,
  useOverlayScrollbar,
} from "./useOverlayScrollbar";

/** True only on devices with a precise hovering pointer (mouse/trackpad).
 *  Touch/coarse devices keep the native OS overlay bar. */
function useFinePointer(): boolean {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setFine(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setFine(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return fine;
}

/** Mirrors remix-utils' useHydrated without the dependency (remix-utils is an
 *  app dependency, not a cyberstorm one): false on server and first client
 *  render, true after mount — so SSR and hydration match. */
function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

function Thumb(props: { api: OverlayScrollbarApi; className: string }) {
  const { api, className } = props;
  if (!api.overflowing) return null;
  return (
    <div
      ref={api.thumbRef}
      className={`${className}${api.visible ? " is-visible" : ""}`}
      onPointerDown={api.onThumbPointerDown}
      onPointerEnter={api.onThumbPointerEnter}
      onPointerLeave={api.onThumbPointerLeave}
      aria-hidden="true"
    />
  );
}

/**
 * Overlay scrollbar for an arbitrary VERTICAL scroll container.
 *
 * Wraps `children` (the scrolling element) in a non-scrolling, position:relative
 * layer and renders an absolutely-positioned thumb as the wrapper's last child.
 * The thumb therefore floats OVER the content and does NOT scroll with it
 * (an absolute child of the scroll element itself would scroll away).
 *
 * The single child must be the scrolling element AND carry the `cs-scroll`
 * class in its markup (which hides the native bar). Applying it statically —
 * rather than on hydration — keeps the content the same width at SSR and on the
 * client, so the floating thumb takes over with zero layout shift. Pass that
 * element's ref as `scrollRef`; the hook reads it for geometry.
 *
 * Vertical only; horizontal overflow is not handled.
 */
export const OverlayScrollbar = memo(function OverlayScrollbar(props: {
  /** Ref to the scrolling element (the single child). */
  scrollRef: React.RefObject<HTMLElement | null>;
  /** The scrolling element. */
  children: ReactNode;
  /** Optional extra classes on the non-scrolling wrapper. */
  wrapperClassName?: string;
}) {
  const { scrollRef, children, wrapperClassName } = props;
  const hydrated = useHydrated();
  const fine = useFinePointer();
  const enabled = hydrated && fine;

  const api = useOverlayScrollbar({
    target: { kind: "element", ref: scrollRef },
    enabled,
  });

  return (
    <div
      className={`cs-scroll-overlay${
        wrapperClassName ? ` ${wrapperClassName}` : ""
      }`}
    >
      {children}
      {enabled ? (
        <Thumb
          api={api}
          className="cs-scrollbar-thumb cs-scrollbar-thumb--container"
        />
      ) : null}
    </div>
  );
});

OverlayScrollbar.displayName = "OverlayScrollbar";

/**
 * Overlay scrollbar for the document/page. Fixed thumb synced to window scroll,
 * preserving native document scroll (so ScrollRestoration, back/forward, hash
 * links and smooth-scroll all keep working). Render once near the end of <body>.
 *
 * Requires `<html class="cs-custom-scrollbars">` in the SSR markup (set in
 * root.tsx) so the native page bar is hidden from first paint — that's what
 * keeps the SSR->client transition shift-free.
 *
 * Vertical only; a horizontally-overflowing page keeps no custom bar (see
 * remaining risks).
 */
export const WindowOverlayScrollbar = memo(function WindowOverlayScrollbar() {
  const hydrated = useHydrated();
  const fine = useFinePointer();
  const enabled = hydrated && fine;
  const [topInset, setTopInset] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    // Measure the sticky header height (unit-agnostic) so the page thumb starts
    // below the nav instead of hiding behind it. <html> carries
    // cs-custom-scrollbars statically (set in root.tsx), so the native bar is
    // already hidden at SSR and there is no hydration reflow to undo here.
    const probe = document.createElement("div");
    probe.style.cssText =
      "position:absolute;visibility:hidden;height:var(--header-height);pointer-events:none;";
    document.body.appendChild(probe);
    setTopInset(probe.getBoundingClientRect().height);
    probe.remove();
  }, [enabled]);

  const api = useOverlayScrollbar({
    target: { kind: "window" },
    enabled,
    topInset,
  });

  if (!enabled) return null;
  return (
    <Thumb
      api={api}
      className="cs-scrollbar-thumb cs-scrollbar-thumb--window"
    />
  );
});

WindowOverlayScrollbar.displayName = "WindowOverlayScrollbar";
