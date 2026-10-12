import * as Sentry from "@sentry/react-router";

import type { AdContainerSizeVariant } from "@thunderstore/cyberstorm";

import { AD_IDLE_TIMEOUT_MS, scheduleWhenIdle } from "./scheduleWhenIdle";

/**
 * NitroPay integration config + SPA lifecycle helpers for Nimbus.
 *
 * The ad surface (publisher 785): a DISPLAY side rail, a single page-level
 * floating video, a single bottom banner, and page-scoped 300×250 sidebar
 * slots (see SidebarAd). The rail (see `app/styles/
 * layout.css`) snaps its WIDTH to a standard ad width (120/160/180/300 — the
 * largest that fits the gutter) and picks its HEIGHT from three fixed tiers
 * (300×600/300×250/300×100), revealing only the tallest that fully fits the
 * rail's available height so a served ad is never clipped (protects viewable %).
 * It sits in a layout gutter beside the content — the right gutter on the search
 * page, the left gutter on package pages — and reveals only when a 120px unit
 * fits beside the 90rem content floor, otherwise it stays hidden. The two routes
 * (community search vs package) render distinct rail ids so they can be reported
 * separately. NitroPay serves whatever wins the auction from a slot's `sizes`
 * list AT ITS NATIVE SIZE — it does NOT measure or scale to the container — so we
 * pass only the inventory sizes that fit the container's measured box (see
 * fittingSizes). The video is a separate single `floating` unit (FLOATING_VIDEO_*)
 * that docks to a viewport corner — created once. All slot ids must be
 * configured in the NitroPay dashboard before they fill.
 */

type NitroAd = {
  id: string;
};

type NitroReport = {
  enabled: boolean;
  wording: string;
  position: string;
  icon?: boolean;
};

export type NitroAdOptions =
  | {
      format: "display";
      demo?: boolean;
      refreshLimit?: number;
      refreshTime?: number;
      renderVisibleOnly?: boolean;
      refreshVisibleOnly?: boolean;
      sizes: string[][];
      report: NitroReport;
      mediaQuery: string;
    }
  | {
      format: "sticky-stack";
      demo?: boolean;
      refreshLimit?: number;
      refreshTime?: number;
      renderVisibleOnly?: boolean;
      refreshVisibleOnly?: boolean;
      stickyStackSpace?: number;
      stickyStackOffset?: number;
      stickyStackResizable?: boolean;
      sizes: string[][];
      report: NitroReport;
      mediaQuery: string;
    }
  | {
      format: "floating";
      demo?: boolean;
      refreshLimit?: number;
      refreshTime?: number;
      floating?: {
        // Lower-left or lower-right corner; NitroPay defaults to "right".
        position?: "left" | "right";
        reduceMobileSize?: boolean;
      };
      report: NitroReport;
    };

export interface NitroAds {
  createAd: (
    containerId: string,
    params: NitroAdOptions
  ) => NitroAd | Promise<NitroAd> | Promise<NitroAd[]> | null;
}

export type RenderedAdSlot = {
  containerId: string;
  sizeVariant: AdContainerSizeVariant;
  options: NitroAdOptions;
};

// Render static placeholders instead of real ad calls, so the layout — incl. the
// bottom-right floating video — can be inspected without dashboard-configured
// slots. This drives the SCRIPT-LEVEL `data-demo` attribute (see AdsInit in
// root.tsx): NitroPay's global demo switch — equivalent to the `?nitro_demo=1`
// URL param the demo page uses — which forces placeholders for EVERY placement
// from script init (no URL param or navigation needed). The per-ad `demo` option
// below alone proved unreliable, so the script-level switch is the one that
// matters; `renderVisibleOnly` is also flipped so placeholders show immediately.
// Keep false in production (real ads); flip to true locally to inspect the
// layout with NitroPay's placeholders.
export const AD_DEMO_MODE: boolean = false;

// Report-button placements overlay the ad's corner. The slot container no
// longer clips its box (AdContainer.css, TS-3940), so the chip stays visible
// and clickable at the corner instead of being cut off by the box edge.
const DISPLAY_REPORT: NitroReport = {
  enabled: true,
  wording: "Report Ad",
  position: "bottom-right",
};

const TOP_LEFT_REPORT: NitroReport = {
  enabled: true,
  wording: "Report Ad",
  position: "top-left",
};

// --- Size inventory ---

// Every unit we serve (the union of the live Django site's ad config), ordered
// largest-first within each width class — NitroPay's demo placeholders render
// the first eligible size. Per-slot lists are derived by filtering this to
// what fits the slot's box, so a slot can never be configured with a size its
// container would clip.
const AD_UNIT_INVENTORY: string[][] = [
  ["980", "120"],
  ["980", "90"],
  ["970", "250"],
  ["970", "90"],
  ["950", "90"],
  ["930", "180"],
  ["750", "200"],
  ["750", "100"],
  ["728", "90"],
  ["468", "60"],
  ["336", "280"],
  ["320", "480"],
  ["320", "100"],
  ["320", "50"],
  ["300", "600"],
  ["300", "250"],
  ["300", "100"],
  ["300", "50"],
  ["250", "360"],
  ["250", "250"],
  ["240", "400"],
  ["234", "60"],
  ["216", "36"],
  ["200", "200"],
  ["180", "150"],
  ["168", "28"],
  ["160", "600"],
  ["125", "125"],
  ["120", "600"],
  ["120", "240"],
  ["120", "60"],
  ["120", "20"],
  ["88", "31"],
];

// All inventory units that fit a maxWidth × maxHeight box (the slot's content
// box — see the AdContainer.css sizing rule).
function sizesThatFit(maxWidth: number, maxHeight: number): string[][] {
  return AD_UNIT_INVENTORY.filter(
    ([width, height]) =>
      Number(width) <= maxWidth && Number(height) <= maxHeight
  );
}

// The bottom ad's candidate pool — every unit up to 980×250 (980 is the widest
// unit with real bidding pressure). createNimbusAd narrows it to what fits the
// container's measured box (its width is capped at 980, see layout.css).
const BOTTOM_AD_SIZES = sizesThatFit(980, 250);

// The sidebar ads' candidate pool (community search + package listing) — every
// unit up to the 300×250 rectangle. createNimbusAd narrows it to what fits the
// container's measured box.
const SIDEBAR_AD_SIZES = sizesThatFit(300, 250);

// --- Slot inventory ---

// The rail reveals at the smallest ad step: the layout reserves a stepped ad
// gutter (--ad-gutter-min in layout.css) from ~1700px up, where a 120px unit
// first fits in the gutter beside the 90rem content floor (content no longer
// shrinks to make room — see layout.css). Below that the gutter holds only the
// content padding, so no unit fits. The CSS container query (nimbus-ad-gutter)
// is the precise gate and snaps the rail width; this viewport query is the
// coarse NitroPay backstop and MUST match the smallest --ad-gutter-min
// breakpoint.
const RAIL_MQ = "(min-width: 1700px)";

// Shared knobs for every display placement; per-slot config is the box (sizes),
// the reveal breakpoint, the report-button corner, and an optional refresh
// policy (the bottom row overrides the rail defaults — see BOTTOM_AD_REFRESH).
function displaySlot(slot: {
  containerId: string;
  sizeVariant: AdContainerSizeVariant;
  sizes: string[][];
  mediaQuery: string;
  report?: NitroReport;
  refreshLimit?: number;
  refreshTime?: number;
}): RenderedAdSlot {
  return {
    containerId: slot.containerId,
    sizeVariant: slot.sizeVariant,
    options: {
      format: "display",
      demo: AD_DEMO_MODE,
      // Rail display defaults: unlimited 60s auto-refresh (the video slot uses
      // 30s). Callers can override per slot (the bottom row does).
      refreshLimit: slot.refreshLimit ?? 0,
      refreshTime: slot.refreshTime ?? 60,
      // Demo placeholders render immediately (not gated on the slot scrolling
      // into view) so the layout is easy to inspect; production stays
      // viewport-gated for viewability/CTR.
      renderVisibleOnly: !AD_DEMO_MODE,
      refreshVisibleOnly: !AD_DEMO_MODE,
      sizes: slot.sizes,
      report: slot.report ?? DISPLAY_REPORT,
      mediaQuery: slot.mediaQuery,
    },
  };
}

// Slot ids follow `nimbus-v<N>-<page>-<position>-<size>` so each placement can be
// configured in the NitroPay dashboard and filtered in analytics by page /
// position / size. Bump AD_SLOT_VERSION on any slot layout or inventory change.
// Styles target ad containers by class + data-size (see layout.css /
// AdContainer), never by id, so these ids are free to change here.
const AD_SLOT_VERSION = 2;
const AD_PREFIX = `nimbus-v${AD_SLOT_VERSION}`;

// Version-independent placement key for telemetry — strips the `nimbus-v<N>-`
// prefix and the trailing `-<w>x<h>` size so bumping AD_SLOT_VERSION (or moving a
// size tier) doesn't split one placement's Sentry issues. Used by the ad error
// boundaries (AdErrorBoundary) to fingerprint per placement, e.g.
// "nimbus-v2-community-sidebar-300x250" → "community-sidebar".
export function adPlacementKey(containerId: string): string {
  return containerId.replace(/^nimbus-v\d+-/, "").replace(/-\d+x\d+$/, "");
}

// Single page-level floating video (NitroPay `floating` format): docks to a
// viewport corner rather than living in the rail, so it's created once (not per
// rail config) and has no width/height gating — its container is a plain empty
// div (see FLOATING_VIDEO_ID in root.tsx), not a reserved-box AdContainer. Re-
// enabled (TS-3954) after NitroPay blocked the rubiconproject requests.
export const FLOATING_VIDEO_ID = `${AD_PREFIX}-floating-video`;

const FLOATING_VIDEO_OPTIONS: NitroAdOptions = {
  format: "floating",
  demo: AD_DEMO_MODE,
  refreshLimit: 0,
  // 30s auto-refresh for the video (display slots use 60s).
  refreshTime: 30,
  // Dock to the bottom-right corner (NitroPay's default, set explicitly to match
  // the placement spec); smaller player on phones so it doesn't dominate.
  floating: { position: "right", reduceMobileSize: true },
  report: { ...TOP_LEFT_REPORT, icon: true },
};

// Rail skyscraper height tiers. NitroPay serves a unit at its native size (it
// never scales), so one variable-height rail would clip a too-tall creative on a
// short viewport and hurt viewable %. Instead each tier is a FIXED-height box,
// and layout.css reveals only the tallest that fully fits the rail's available
// height (the nimbus-ad-gutter rules still snap the width). Three tiers, tall →
// short, each an exact 300-wide unit; its `sizes` pool is capped at that height
// and createNimbusAd narrows further to the snapped width. Ordered tall-first
// for readability (layout.css does the height gating, not this order).
const RAIL_TIERS: {
  size: string;
  sizeVariant: AdContainerSizeVariant;
  sizes: string[][];
}[] = [
  {
    size: "300x600",
    sizeVariant: "rail-300x600",
    sizes: sizesThatFit(300, 600),
  },
  {
    size: "300x250",
    sizeVariant: "rail-300x250",
    sizes: sizesThatFit(300, 250),
  },
  {
    size: "300x100",
    sizeVariant: "rail-300x100",
    sizes: sizesThatFit(300, 100),
  },
];

// Build a route's three tier slots. The id encodes page + position + size so the
// community and package rails are configured/reported separately in NitroPay.
function railSlots(page: "community" | "package"): RenderedAdSlot[] {
  return RAIL_TIERS.map((tier) =>
    displaySlot({
      containerId: `${AD_PREFIX}-${page}-rail-${tier.size}`,
      sizeVariant: tier.sizeVariant,
      sizes: tier.sizes,
      mediaQuery: RAIL_MQ,
    })
  );
}

// Both routes' rail tiers live in the shared rail stack (root.tsx renders both
// sets); layout.css reveals only the active route's fitting tier. Each tier is
// created lazily on its FIRST reveal (createNimbusAdsInView): a display:none
// container measures 0×0, so creating it eagerly would skip the fittingSizes
// width narrowing and let NitroPay later serve a 300-wide unit into a
// 120-180px-snapped rail.
export const COMMUNITY_RAIL_SLOTS: RenderedAdSlot[] = railSlots("community");
export const PACKAGE_RAIL_SLOTS: RenderedAdSlot[] = railSlots("package");

// Bottom-row refresh policy (overrides the rail display defaults): a 300s
// auto-refresh timer — unlimited, like the rail's but slower than its 60s.
// render/refreshVisibleOnly are inherited from displaySlot (true in
// production). refreshLimit is omitted so it defaults to 0 (unlimited).
const BOTTOM_AD_REFRESH = {
  refreshTime: 300,
} as const;

// A single bottom ad (full-width island between content and footer), centered
// and capped at 980px wide (layout.css). createNimbusAd narrows BOTTOM_AD_SIZES
// to the units that fit the container's measured width before createAd, so no
// per-width slots are needed. Kept as a one-element array so the lifecycle /
// lazy-create helpers stay uniform. Always eligible (min-width: 0).
export const BOTTOM_AD_SLOTS: RenderedAdSlot[] = [
  displaySlot({
    containerId: `${AD_PREFIX}-content-bottom-980x250`,
    sizeVariant: "bottom-banner",
    sizes: BOTTOM_AD_SIZES,
    mediaQuery: "(min-width: 0px)",
    ...BOTTOM_AD_REFRESH,
  }),
];

// Page-scoped 300×250 rectangles rendered by <SidebarAd>: one at the top of each
// package-search filter sidebar (community landing, team packages, dependants)
// and one under the package-listing sidebar. Distinct ids per page so each is
// configured/reported separately in NitroPay. Unlike the layout slots above,
// these containers only exist on their page, so <SidebarAd> creates them.
// Both show the house fallback while unfilled. The coarse mediaQuery keeps phones
// (where the sidebar is hidden) out of the auction; the CSS visibility +
// renderVisibleOnly are the precise gate.
function sidebarAd(page: string): RenderedAdSlot {
  return displaySlot({
    containerId: `${AD_PREFIX}-${page}-sidebar-300x250`,
    sizeVariant: "display-300-250",
    sizes: SIDEBAR_AD_SIZES,
    mediaQuery: "(min-width: 768px)",
  });
}

export const COMMUNITY_SIDEBAR_AD: RenderedAdSlot = sidebarAd("community");
export const PACKAGE_SIDEBAR_AD: RenderedAdSlot = sidebarAd("package");
export const TEAM_SIDEBAR_AD: RenderedAdSlot = sidebarAd("team");
export const DEPENDANTS_SIDEBAR_AD: RenderedAdSlot = sidebarAd("dependants");

// --- Lifecycle ---

const IN_VIEW_ROOT_MARGIN = "200px";

function fittingSizes(mount: Element, candidates: string[][]): string[][] {
  const { width, height } = mount.getBoundingClientRect();
  if (width <= 0 || height <= 0) {
    return candidates;
  }
  const fit = candidates.filter(
    ([w, h]) => Number(w) <= width && Number(h) <= height
  );
  return fit.length > 0 ? fit : candidates;
}

const AD_ERROR_SAMPLE_RATE = 0.001;

function reportAdLifecycleError(error: unknown, containerId: string): void {
  if (!import.meta.env.PROD || Math.random() >= AD_ERROR_SAMPLE_RATE) {
    return;
  }
  const placement = adPlacementKey(containerId);
  Sentry.captureException(error, {
    level: "warning",
    fingerprint: ["ad-container", placement, "create"],
    tags: { ad_placement: placement, ad_phase: "create" },
  });
}

function createNimbusAd(
  nitroAds: NitroAds,
  mount: Element,
  options: NitroAdOptions
): void {
  // Replaced or removed since the creation was scheduled.
  if (!mount.isConnected) {
    return;
  }
  const containerId = mount.id;
  const fittedOptions: NitroAdOptions =
    "sizes" in options
      ? { ...options, sizes: fittingSizes(mount, options.sizes) }
      : options;
  try {
    Promise.resolve(nitroAds.createAd(containerId, fittedOptions)).catch(
      (error: unknown) => {
        reportAdLifecycleError(error, containerId);
      }
    );
  } catch (error) {
    reportAdLifecycleError(error, containerId);
  }
}

type PendingAd = { mount: Element; options: NitroAdOptions };

function createNimbusAdsInView(
  nitroAds: NitroAds,
  ads: PendingAd[]
): () => void {
  if (typeof IntersectionObserver === "undefined") {
    for (const { mount, options } of ads) {
      createNimbusAd(nitroAds, mount, options);
    }
    return () => undefined;
  }

  const pending = new Map(ads.map(({ mount, options }) => [mount, options]));
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const options = pending.get(entry.target);
        if (!entry.isIntersecting || !options) {
          continue;
        }
        pending.delete(entry.target);
        observer.unobserve(entry.target);
        createNimbusAd(nitroAds, entry.target, options);
      }
    },
    { rootMargin: IN_VIEW_ROOT_MARGIN }
  );
  for (const mount of pending.keys()) {
    observer.observe(mount);
  }
  return () => {
    observer.disconnect();
    // Entries already queued can still be delivered after disconnect().
    pending.clear();
  };
}

const LAYOUT_DISPLAY_SLOTS: RenderedAdSlot[] = [
  ...COMMUNITY_RAIL_SLOTS,
  ...PACKAGE_RAIL_SLOTS,
  ...BOTTOM_AD_SLOTS,
];

export function createNimbusLayoutAds(nitroAds: NitroAds): () => void {
  const ads = LAYOUT_DISPLAY_SLOTS.flatMap(({ containerId, options }) => {
    const mount = document.getElementById(containerId);
    return mount ? [{ mount, options }] : [];
  });
  let dropPending: (() => void) | undefined;
  const cancelIdle = scheduleWhenIdle(() => {
    dropPending = createNimbusAdsInView(nitroAds, ads);
  }, AD_IDLE_TIMEOUT_MS);
  return () => {
    cancelIdle();
    dropPending?.();
  };
}

export function createNimbusFloatingVideo(nitroAds: NitroAds): () => void {
  const anchor = document.getElementById(FLOATING_VIDEO_ID);
  if (!anchor) {
    return () => undefined;
  }
  return scheduleWhenIdle(
    () => createNimbusAd(nitroAds, anchor, FLOATING_VIDEO_OPTIONS),
    AD_IDLE_TIMEOUT_MS
  );
}

// --- Script readiness (for page-scoped slots) ---

// window.nitroAds is usable only after the async NitroPay script loads. The
// layout slots are created from AdsInit the moment it observes that load; a
// page-scoped slot (the sidebar ads) lives in a component that can mount
// before the script is ready, so it awaits this instead. AdsInit publishes the
// ref via markNitroAdsReady. Resolves for the rest of the page lifetime once the
// script is in (window.nitroAds persists), so later awaits are instant.
let readyNitroAds: NitroAds | undefined;
const nitroReadyWaiters: Array<(nitroAds: NitroAds) => void> = [];

export function markNitroAdsReady(nitroAds: NitroAds): void {
  if (readyNitroAds) {
    return;
  }
  readyNitroAds = nitroAds;
  const waiters = nitroReadyWaiters.splice(0);
  for (const resolve of waiters) {
    resolve(nitroAds);
  }
}

// Resolves once the NitroPay script loads (markNitroAdsReady). If the script is
// blocked (adblock/network) it never loads, so callers MUST pass an AbortSignal
// and abort on unmount — otherwise every mount leaves an unresolved waiter and a
// retained `.then` closure, accumulating over a session. On abort the waiter is
// dropped and the promise resolves to null so the caller's closure is released.
function whenNitroAdsReady(signal?: AbortSignal): Promise<NitroAds | null> {
  if (readyNitroAds) {
    return Promise.resolve(readyNitroAds);
  }
  return new Promise((resolve) => {
    if (signal?.aborted) {
      resolve(null);
      return;
    }
    const waiter = (nitroAds: NitroAds) => resolve(nitroAds);
    nitroReadyWaiters.push(waiter);
    signal?.addEventListener(
      "abort",
      () => {
        const index = nitroReadyWaiters.indexOf(waiter);
        if (index !== -1) {
          nitroReadyWaiters.splice(index, 1);
        }
        resolve(null);
      },
      { once: true }
    );
  });
}

// --- Page-scoped sidebar ads (created by <SidebarAd>) ---

export function createNimbusPageScopedAd(slot: RenderedAdSlot): () => void {
  const mount = document.getElementById(slot.containerId);
  if (!mount) {
    return () => undefined;
  }
  const ready = new AbortController();
  let cancelIdle: (() => void) | undefined;
  whenNitroAdsReady(ready.signal).then((nitroAds) => {
    if (nitroAds && !ready.signal.aborted) {
      cancelIdle = scheduleWhenIdle(
        () => createNimbusAd(nitroAds, mount, slot.options),
        AD_IDLE_TIMEOUT_MS
      );
    }
  });
  return () => {
    ready.abort();
    cancelIdle?.();
  };
}
