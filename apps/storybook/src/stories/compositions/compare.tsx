import { TopLayerContainerContext } from "@cs/utils/TopLayerContainerContext";
import { type ReactNode, useLayoutEffect, useRef, useState } from "react";

import "./compare.css";

/**
 * Featuring rule for Chromatic compositions.
 *
 * Every exported Cyberstorm component is featured in at least one composition.
 * A component with no composition slot is not covered by Chromatic. Feature it
 * once by default, so a change diffs that one composition. Feature it again
 * only when a second appearance is mandatory for the layout, or is the
 * reasonable way to show a state the first slot does not cover. Shared
 * primitives (Button, Icon, Heading, Link) are the usual case. Overlay
 * components are the other: closed in one page composition, open in their own
 * story. Do not repeat them beyond that, and do not put Navigation, header, or
 * footer on every composition.
 *
 * A component rendered inside another (Button inside Modal, Pagination, or a
 * card) still diffs the composition that features the outer component. That
 * inner use is not a second featuring.
 *
 * RelativeTime and LocalDateTime are not featured. RelativeTime reads
 * Date.now(). LocalDateTime rewrites its label after mount into the viewer's
 * timezone. Either label would change between captures. LocalDateTime still
 * has a catalog story, with snapshots disabled.
 *
 * These stories render the layout twice, themed on the left and barebones on
 * the right, in one snapshot. They opt out of the preview theme wrapper.
 */

export function SideBySide({
  render,
}: {
  render: (scope: string) => ReactNode;
}) {
  return (
    <div className="cs-compare">
      <Column themed>{render("themed")}</Column>
      <Column>{render("bare")}</Column>
    </div>
  );
}

function Column({
  themed = false,
  children,
}: {
  themed?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    setContainer(ref.current);
  }, []);

  return (
    <div
      ref={ref}
      className="cs-compare__column"
      data-cs-theme={themed ? "on" : undefined}
    >
      <p className="cs-compare__caption">{themed ? "Themed" : "Barebones"}</p>
      {container ? (
        <TopLayerContainerContext.Provider value={container}>
          {children}
        </TopLayerContainerContext.Provider>
      ) : null}
    </div>
  );
}

/** Holds one open overlay inside this box instead of the shared column. */
export function PortalFrame({
  children,
  minHeight,
}: {
  children: ReactNode;
  minHeight: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    setContainer(ref.current);
  }, []);

  return (
    <div ref={ref} className="cs-compare__portal-frame" style={{ minHeight }}>
      {container ? (
        <TopLayerContainerContext.Provider value={container}>
          {children}
        </TopLayerContainerContext.Provider>
      ) : null}
    </div>
  );
}

export function States({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="cs-states">
      <p className="cs-states__title">{title}</p>
      <div className="cs-states__row">{children}</div>
    </section>
  );
}

/**
 * Drawer and Menu have no open prop. Open the popover once, then pin it to
 * its page box. An open popover is in the browser top layer, so both columns
 * would otherwise attach to the same viewport edge.
 */
export function OpenPopover({ popoverId }: { popoverId: string }) {
  useLayoutEffect(() => {
    const node = document.getElementById(popoverId);
    if (!(node instanceof HTMLElement) || !node.hasAttribute("popover")) {
      return;
    }
    if (!node.matches(":popover-open")) {
      node.showPopover();
    }

    const page = node.closest(".cs-compare__page");
    if (!(page instanceof HTMLElement)) {
      return;
    }

    const place = () => {
      const rect = page.getBoundingClientRect();
      node.style.top = `${rect.top}px`;
      node.style.left = `${rect.left}px`;
      node.style.width = `${rect.width}px`;
      node.style.height = `${rect.height}px`;
      node.style.right = "auto";
      node.style.bottom = "auto";
      node.style.margin = "0";
    };
    place();

    const observer = new ResizeObserver(place);
    observer.observe(page);
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [popoverId]);

  return null;
}

export const compositionParameters = {
  layout: "fullscreen" as const,
  csSideBySide: true,
  chromatic: { viewports: [2000] },
};
