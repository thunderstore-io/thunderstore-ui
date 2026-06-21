import type { AdContainerSizeVariant } from "@thunderstore/cyberstorm";

/**
 * NitroPay integration config + SPA lifecycle helpers for Nimbus.
 *
 * The ad surface (publisher 785): a right-column rail plus a responsive bottom
 * banner row. The rail's CONFIGURATION is chosen by HEIGHT via CSS container
 * queries (see `app/styles/layout.css`): shortest to tallest, 2 fishsticks ->
 * fishstick + square -> + fishstick -> double -> + fishstick -> + square ->
 * + double, with the video in every config and always pinned to the
 * bottom. Each configuration owns its OWN fixed-size slots (ids
 * `nimbus-v<AD_SLOT_VERSION>-<config>-<position>-<type>`), so a slot is never reused at
 * two sizes. The rail is 336px wide on large viewports and a single 160px fill
 * slot on mid-width ones. NitroPay measures each slot's container and only loads
 * sizes that fit it. Rail slots are created eagerly; each carries its config's
 * `mediaQuery` (the width regime — full 336px vs 160px narrow rail — AND its
 * config's window-height band), so NitroPay serves only the config matching the
 * current window while CSS hides the rest. The visual reveal is the CSS
 * container query (layout.css); the mediaQuery keeps NitroPay in step. All slot
 * ids must be configured in the NitroPay dashboard before they fill.
 *
 * Types are derived from the NitroPay API docs (api-docs.nitropay.com):
 * `createAd` returns a `NitroAd` (or a promise of one/an array), whose
 * `onNavigate()` is the documented SPA "new pageview" signal. Navigation
 * refreshes are gated locally by MIN_AD_LIFETIME_MS, with each slot's
 * `onNavigateMin` (milliseconds, verified against the shipped ads bundle)
 * mirroring the same floor inside NitroPay as belt-and-braces.
 */

export type NitroAd = {
  id: string;
  onNavigate: (href?: string) => void;
  renderContainers: () => Promise<boolean>;
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
      onNavigateMin?: number;
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
      onNavigateMin?: number;
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
      onNavigateMin?: number;
      floating?: {
        reduceMobileSize?: boolean;
      };
      report: NitroReport;
    }
  | {
      format: "video-nc";
      demo?: boolean;
      refreshLimit?: number;
      refreshTime?: number;
      onNavigateMin?: number;
      video?: {
        // "never" disables the floating (out-of-view docked) player entirely.
        float?: "after" | "always" | "auto" | "never";
      };
      report: NitroReport;
      mediaQuery: string;
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

// Minimum creative lifetime (since slot creation or last refresh) before an SPA
// navigation may refresh ads — 45s favours viewability/CTR over churn. Enforced
// in onNavigateNimbusAds and mirrored to NitroPay per slot via `onNavigateMin`.
const MIN_AD_LIFETIME_MS = 45000;
const ON_NAVIGATE_MIN = MIN_AD_LIFETIME_MS;

// Set to true to render static placeholders instead of making real ad calls,
// so the layout can be inspected without dashboard-configured slots.
const AD_DEMO_MODE = false;

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

// Right rail: the slim fishstick boxes, the two display boxes — "square"
// (336x300) and "double" (336x600, twice as tall) — and the 160-wide
// narrow-rail fill slot.
const FISHSTICK_SIZES = sizesThatFit(336, 60);
const RIGHT_SQUARE_SIZES = sizesThatFit(336, 300);
const RIGHT_DOUBLE_SIZES = sizesThatFit(336, 600);
const RIGHT_NARROW_SIZES = sizesThatFit(160, 600);

// Bottom row: capped at 980 wide (there is almost no bidding pressure above
// that) and 250 tall (the row's box). The narrower bands keep the live Django
// site's historical width caps.
const BOTTOM_VERY_WIDE_SIZES = sizesThatFit(980, 250);
const BOTTOM_WIDE_SIZES = sizesThatFit(930, 250);
const BOTTOM_NARROW_SIZES = sizesThatFit(690, 250);
const BOTTOM_VERY_NARROW_SIZES = sizesThatFit(510, 250);

// The right-side companions grow with the leftover row width (90px floor up
// to 980), so they serve the same pool as the very-wide banner — NitroPay
// filters it down to the measured container.
const BOTTOM_RIGHT_SIZES = BOTTOM_VERY_WIDE_SIZES;

// --- Slot inventory ---

// Rail WIDTH regimes: full 336px rail at >= 1484px (the old Django site's rail
// breakpoint); a 160px narrow rail from 1214px to 1483.98px; below 1214px the
// bottom banner row is the only ad surface.
const RIGHT_COLUMN_MQ = "(min-width: 1484px)";
const RIGHT_COLUMN_NARROW_MQ = "(min-width: 1214px) and (max-width: 1483.98px)";

// Chrome reserved above + below the sticky rail stack (mirrors the height calc
// in layout.css: header + gap-2xs top + gap-2xs bottom). layout.css reveals a
// config by the rail's own (container) height; NitroPay's mediaQuery is a
// viewport query, so viewport height = rail (container) height + this.
const RAIL_CHROME_PX = 64;

// A config's NitroPay mediaQuery: the 336px-rail width regime plus that config's
// rail-height band expressed as VIEWPORT height, so NitroPay only serves the
// config's slots at the window heights where layout.css shows them. These bands
// MUST mirror the @container bands in layout.css.
function railHeightMq(minRail: number, maxRail: number | null): string {
  const parts = [
    RIGHT_COLUMN_MQ,
    `(min-height: ${minRail + RAIL_CHROME_PX}px)`,
  ];
  if (maxRail !== null) {
    parts.push(`(max-height: ${maxRail + RAIL_CHROME_PX - 0.02}px)`);
  }
  return parts.join(" and ");
}

// Per-config rail mediaQueries; all of a config's slots share one.
const RAIL_MQ_1 = railHeightMq(331, 571);
const RAIL_MQ_2 = railHeightMq(571, 641);
const RAIL_MQ_3 = railHeightMq(641, 871);
const RAIL_MQ_4 = railHeightMq(871, 941);
const RAIL_MQ_5 = railHeightMq(941, 1181);
const RAIL_MQ_6 = railHeightMq(1181, 1481);
const RAIL_MQ_7 = railHeightMq(1481, null);

// Rail video slot ids all end with this suffix (one per configuration that
// includes a video — see RIGHT_COLUMN_SLOTS). They're excluded from onNavigate
// refreshes (see onNavigateNimbusAds) so an in-progress impression isn't torn
// down on every route change — the rail persists across navigations.
const RAIL_VIDEO_ID_SUFFIX = "-video";

// Shared knobs for every display placement; per-slot config is just the box
// (sizes), the reveal breakpoint, and the report-button corner.
function displaySlot(slot: {
  containerId: string;
  sizeVariant: AdContainerSizeVariant;
  sizes: string[][];
  mediaQuery: string;
  report?: NitroReport;
}): RenderedAdSlot {
  return {
    containerId: slot.containerId,
    sizeVariant: slot.sizeVariant,
    options: {
      format: "display",
      demo: AD_DEMO_MODE,
      refreshLimit: 0,
      // 300s (5 min) auto-refresh: longer dwell for better viewability/CTR.
      refreshTime: 90,
      onNavigateMin: ON_NAVIGATE_MIN,
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

// Bump AD_SLOT_VERSION whenever the ad slot layout or inventory changes: every
// slot id (rail + bottom row) is `nimbus-v<N>-...`, so analytics can cleanly
// filter each iteration by the id prefix. This is the ONLY place to change it —
// layout.css matches slots by their version-independent suffix, not the prefix.
const AD_SLOT_VERSION = 1;
const AD_PREFIX = `nimbus-v${AD_SLOT_VERSION}`;

// Rail slot builders — each configuration owns fixed-size slots (see the
// progression + breakpoints in layout.css). Each takes its config's mediaQuery
// (width regime + the config's window-height band) so all of a config's slots
// share the same reveal condition.

function railFishstick(id: string, mediaQuery: string): RenderedAdSlot {
  return displaySlot({
    containerId: id,
    sizeVariant: "fishstick",
    sizes: FISHSTICK_SIZES,
    mediaQuery,
  });
}

// Display slots come in two heights, named in the id: `-square` (336x300) and
// `-double` (336x600, twice as tall). The id's size token drives the box.
function railDisplay(id: string, mediaQuery: string): RenderedAdSlot {
  const square = id.endsWith("-square");
  return displaySlot({
    containerId: id,
    sizeVariant: square ? "rail-square" : "rail-double",
    sizes: square ? RIGHT_SQUARE_SIZES : RIGHT_DOUBLE_SIZES,
    mediaQuery,
  });
}

// In-content video player; pinned to the rail's bottom in every config. Re-
// enabled (TS-3954) after NitroPay blocked the rubiconproject requests.
function railVideo(id: string, mediaQuery: string): RenderedAdSlot {
  return {
    containerId: id,
    sizeVariant: "video",
    options: {
      format: "video-nc",
      demo: AD_DEMO_MODE,
      refreshLimit: 0,
      // 30s auto-refresh for the video slot (display slots stay at 90s).
      refreshTime: 30,
      onNavigateMin: ON_NAVIGATE_MIN,
      // The rail keeps the player on screen; never detach into the floating
      // (docked) player, which otherwise covers the footer on tall layouts.
      video: { float: "never" },
      report: { ...TOP_LEFT_REPORT, icon: true },
      mediaQuery,
    },
  };
}

// One fixed-size slot per ad per configuration (ids <config>-<position>-<type>).
// CSS container queries (layout.css) show exactly one config's slots per rail
// height; the narrow slot is the 160px width regime's only placement.
export const RIGHT_COLUMN_SLOTS: RenderedAdSlot[] = [
  // 1 — fishstick + fishstick + video
  railFishstick(`${AD_PREFIX}-1-1-fishstick`, RAIL_MQ_1),
  railFishstick(`${AD_PREFIX}-1-2-fishstick`, RAIL_MQ_1),
  railVideo(`${AD_PREFIX}-1-3-video`, RAIL_MQ_1),
  // 2 — fishstick + square + video
  railFishstick(`${AD_PREFIX}-2-1-fishstick`, RAIL_MQ_2),
  railDisplay(`${AD_PREFIX}-2-2-square`, RAIL_MQ_2),
  railVideo(`${AD_PREFIX}-2-3-video`, RAIL_MQ_2),
  // 3 — fishstick + square + fishstick + video
  railFishstick(`${AD_PREFIX}-3-1-fishstick`, RAIL_MQ_3),
  railDisplay(`${AD_PREFIX}-3-2-square`, RAIL_MQ_3),
  railFishstick(`${AD_PREFIX}-3-3-fishstick`, RAIL_MQ_3),
  railVideo(`${AD_PREFIX}-3-4-video`, RAIL_MQ_3),
  // 4 — fishstick + double + video
  railFishstick(`${AD_PREFIX}-4-1-fishstick`, RAIL_MQ_4),
  railDisplay(`${AD_PREFIX}-4-2-double`, RAIL_MQ_4),
  railVideo(`${AD_PREFIX}-4-3-video`, RAIL_MQ_4),
  // 5 — fishstick + double + fishstick + video
  railFishstick(`${AD_PREFIX}-5-1-fishstick`, RAIL_MQ_5),
  railDisplay(`${AD_PREFIX}-5-2-double`, RAIL_MQ_5),
  railFishstick(`${AD_PREFIX}-5-3-fishstick`, RAIL_MQ_5),
  railVideo(`${AD_PREFIX}-5-4-video`, RAIL_MQ_5),
  // 6 — fishstick + double + square + video
  railFishstick(`${AD_PREFIX}-6-1-fishstick`, RAIL_MQ_6),
  railDisplay(`${AD_PREFIX}-6-2-double`, RAIL_MQ_6),
  railDisplay(`${AD_PREFIX}-6-3-square`, RAIL_MQ_6),
  railVideo(`${AD_PREFIX}-6-4-video`, RAIL_MQ_6),
  // 7 — fishstick + double + double + video
  railFishstick(`${AD_PREFIX}-7-1-fishstick`, RAIL_MQ_7),
  railDisplay(`${AD_PREFIX}-7-2-double`, RAIL_MQ_7),
  railDisplay(`${AD_PREFIX}-7-3-double`, RAIL_MQ_7),
  railVideo(`${AD_PREFIX}-7-4-video`, RAIL_MQ_7),
  // Narrow (160px) width regime — single fill slot.
  displaySlot({
    containerId: `${AD_PREFIX}-narrow`,
    sizeVariant: "narrow-dynamic",
    sizes: RIGHT_NARROW_SIZES,
    mediaQuery: RIGHT_COLUMN_NARROW_MQ,
  }),
];

// The responsive bottom-banner row (full-width island between content and
// footer); only the breakpoint-matching banner reveals.
export const BOTTOM_BANNER_AD_SLOTS: RenderedAdSlot[] = [
  displaySlot({
    containerId: `${AD_PREFIX}-bottom-ad-very-narrow`,
    sizeVariant: "bottom-banner",
    sizes: BOTTOM_VERY_NARROW_SIZES,
    mediaQuery: "(max-width: 767.98px)",
  }),
  displaySlot({
    containerId: `${AD_PREFIX}-bottom-ad-narrow`,
    sizeVariant: "bottom-banner",
    sizes: BOTTOM_NARROW_SIZES,
    mediaQuery: "(min-width: 768px) and (max-width: 991.98px)",
  }),
  displaySlot({
    containerId: `${AD_PREFIX}-bottom-ad-wide`,
    sizeVariant: "bottom-banner",
    sizes: BOTTOM_WIDE_SIZES,
    mediaQuery: "(min-width: 992px) and (max-width: 1199.98px)",
  }),
  displaySlot({
    containerId: `${AD_PREFIX}-bottom-ad-very-wide`,
    sizeVariant: "bottom-banner",
    sizes: BOTTOM_VERY_WIDE_SIZES,
    mediaQuery: "(min-width: 1200px)",
  }),
];

// Companion placements after the banner; each reveals as soon as the
// full-width row fits the smallest unit we serve (88px wide) next to the
// already-capped placements: the second at 982 + 90 + gaps = 1120px
// viewports, the third at 2×982 + 90 + gaps = 2118px.
export const BOTTOM_RIGHT_AD_SLOTS: RenderedAdSlot[] = [
  displaySlot({
    containerId: `${AD_PREFIX}-bottom-ad-right`,
    sizeVariant: "bottom-right",
    sizes: BOTTOM_RIGHT_SIZES,
    mediaQuery: "(min-width: 1120px)",
    report: TOP_LEFT_REPORT,
  }),
  displaySlot({
    containerId: `${AD_PREFIX}-bottom-ad-third`,
    sizeVariant: "bottom-right",
    sizes: BOTTOM_RIGHT_SIZES,
    mediaQuery: "(min-width: 2118px)",
    report: TOP_LEFT_REPORT,
  }),
];

// --- Lifecycle (module-scope so refs survive AdsInit unmount/remount) ---

// Live NitroAd refs, keyed by container id, used to drive onNavigate. AdsInit
// guards createAd to run once per mount (see its `hasCreatedAds` ref), so we do
// not need a separate dedupe set here.
const adRegistry = new Map<string, NitroAd>();

// Bumped on every teardown so createAd resolutions still in flight from a
// previous generation are dropped instead of repopulating the cleared registry
// with refs to slots whose container divs were already unmounted.
let adGeneration = 0;

// When the current creatives went live: set on slot creation and on each
// navigation-driven refresh. Drives the MIN_AD_LIFETIME_MS guard.
let adsLiveSince = 0;

// Below-the-fold bottom-row slots are created lazily — their createAd call is
// deferred until the slot scrolls within this margin of the viewport — so we
// never run an auction for a slot the user may never reach. Above-the-fold rail
// slots stay eager. (renderVisibleOnly/refreshVisibleOnly only gate NitroPay's
// render+refresh; the slot is otherwise still created eagerly on load.)
const IN_VIEW_ROOT_MARGIN = "200px";
let adInViewObserver: IntersectionObserver | undefined;
const pendingInViewSlots = new Map<
  string,
  { nitroAds: NitroAds; options: NitroAdOptions }
>();

function createNimbusAd(
  nitroAds: NitroAds,
  containerId: string,
  options: NitroAdOptions
): void {
  const generation = adGeneration;
  try {
    // createAd may return synchronously or as a promise (per the docs). Capture
    // the NitroAd ref so we can drive onNavigate on client-side navigation.
    Promise.resolve(nitroAds.createAd(containerId, options))
      .then((ad) => {
        if (generation !== adGeneration) {
          // Torn down while the creation was in flight; the container div is
          // gone and NitroPay has freed the slot.
          return;
        }
        const resolved = Array.isArray(ad) ? ad[0] : ad;
        if (resolved) {
          adRegistry.set(containerId, resolved);
        }
      })
      .catch(() => {
        // Creation failed (e.g. blocked); nothing to register.
      });
  } catch {
    // createAd threw synchronously; nothing to register.
  }
}

/**
 * Create each slot lazily, once its container scrolls near the viewport. Slots
 * that are `display: none` for the current breakpoint never intersect, so only
 * the matching one is created (NitroPay's `mediaQuery` is the backstop). Falls
 * back to eager creation when IntersectionObserver is unavailable.
 */
function createNimbusAdsInView(
  nitroAds: NitroAds,
  slots: RenderedAdSlot[]
): void {
  if (
    typeof window === "undefined" ||
    typeof IntersectionObserver === "undefined"
  ) {
    for (const slot of slots) {
      createNimbusAd(nitroAds, slot.containerId, slot.options);
    }
    return;
  }

  if (!adInViewObserver) {
    adInViewObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }
          const containerId = entry.target.id;
          adInViewObserver?.unobserve(entry.target);
          const pending = pendingInViewSlots.get(containerId);
          pendingInViewSlots.delete(containerId);
          if (pending) {
            createNimbusAd(pending.nitroAds, containerId, pending.options);
          }
        }
      },
      { rootMargin: IN_VIEW_ROOT_MARGIN }
    );
  }

  for (const slot of slots) {
    const container = document.getElementById(slot.containerId);
    if (!container) {
      continue;
    }
    pendingInViewSlots.set(slot.containerId, {
      nitroAds,
      options: slot.options,
    });
    adInViewObserver.observe(container);
  }
}

/**
 * Create every Nimbus ad slot. Rail slots are created EAGERLY: each carries its
 * config's mediaQuery (width regime + window-height band), so NitroPay serves
 * only the config matching the current window and CSS hides the rest — there's
 * no need to gate creation on scroll/intersection. With AD_DEMO_MODE on, each
 * slot is created with `demo: true` so NitroPay paints its own demo placeholders
 * (NitroPay's demo is unreliable for the larger units / backgrounded tabs). The
 * below-the-fold bottom banner row stays lazy, created only once it scrolls near
 * the viewport (see createNimbusAdsInView).
 */
export function createAllNimbusAds(nitroAds: NitroAds): void {
  adsLiveSince = Date.now();

  for (const slot of RIGHT_COLUMN_SLOTS) {
    createNimbusAd(nitroAds, slot.containerId, slot.options);
  }
  createNimbusAdsInView(nitroAds, [
    ...BOTTOM_BANNER_AD_SLOTS,
    ...BOTTOM_RIGHT_AD_SLOTS,
  ]);
}

/**
 * Tell NitroPay a new pageview happened (SPA navigation). Clears + refreshes
 * each live slot. Called from the root layout for the key pageview-like
 * actions — route changes plus search/filter/pagination (query string)
 * changes — but only acts when the current creatives have had their
 * MIN_AD_LIFETIME_MS, so rapid navigation can't churn ads that never had a
 * chance to earn a click. Excludes the rail video so an in-progress video
 * impression isn't torn down on route change.
 */
export function onNavigateNimbusAds(): void {
  const now = Date.now();
  if (now - adsLiveSince < MIN_AD_LIFETIME_MS) {
    return;
  }
  adsLiveSince = now;
  adRegistry.forEach((ad, id) => {
    if (id.endsWith(RAIL_VIDEO_ID_SUFFIX)) {
      return;
    }
    try {
      ad.onNavigate();
    } catch {
      // Slot may be mid-initialization; ignore.
    }
  });
}

/**
 * Forget the slot refs on unmount (e.g. navigating to an ad-suppressed route).
 * React removes the slots' `#id` container divs, and per the NitroPay docs
 * "the div being removed will be detected, and any related resources will be
 * freed", so a later remount re-creates them on fresh containers.
 */
export function teardownNimbusAds(): void {
  adGeneration += 1;
  adRegistry.clear();
  // Stop watching not-yet-created bottom slots so a pending lazy createAd can't
  // fire against a torn-down container after unmount.
  adInViewObserver?.disconnect();
  adInViewObserver = undefined;
  pendingInViewSlots.clear();
}
