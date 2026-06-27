import type { AdContainerSizeVariant } from "@thunderstore/cyberstorm";

/**
 * NitroPay integration config + SPA lifecycle helpers for Nimbus.
 *
 * The ad surface (publisher 785): a right-column DISPLAY rail, a single
 * page-level floating video, and a single bottom banner. The rail holds up to
 * two ad containers (see `app/styles/layout.css`): the width snaps to a standard
 * ad width (160/180/200/250/280/300/320/336 — the largest that fits the gutter),
 * and the first container grows to 600px tall before the second appears, with the
 * bottom reserved so no ad sits behind the floating video. NitroPay serves
 * whatever wins the auction from each slot's `sizes` list AT ITS NATIVE SIZE — it
 * does NOT measure or scale to the container — so we pass only the inventory
 * sizes that fit each container's measured box (see fittingSizes). The video is a
 * separate single `floating` unit (FLOATING_VIDEO_*) that docks to a viewport
 * corner — created once, excluded from navigation refreshes. All slot ids must be
 * configured in the NitroPay dashboard before they fill.
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
        // Lower-left or lower-right corner; NitroPay defaults to "right".
        position?: "left" | "right";
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

// Minimum creative lifetime (since the slot's last render — the initial render
// OR any refresh, INCLUDING NitroPay's own timer auto-refresh) before an SPA
// navigation may refresh it; 40s favours viewability/CTR over churn. Enforced
// per-slot in onNavigateNimbusAds via the nitroAds.rendered event
// (lastRenderedAt) and mirrored to NitroPay per slot via `onNavigateMin`.
const MIN_AD_LIFETIME_MS = 40000;
const ON_NAVIGATE_MIN = MIN_AD_LIFETIME_MS;

// Render static placeholders instead of real ad calls, so the layout — incl. the
// bottom-right floating video — can be inspected without dashboard-configured
// slots. This drives the SCRIPT-LEVEL `data-demo` attribute (see AdsInit in
// root.tsx): NitroPay's global demo switch — equivalent to the `?nitro_demo=1`
// URL param the demo page uses — which forces placeholders for EVERY placement
// from script init (no URL param or navigation needed). The per-ad `demo` option
// below alone proved unreliable, so the script-level switch is the one that
// matters; `renderVisibleOnly` is also flipped so placeholders show immediately.
// TEMPORARY: revert to false before shipping — demo serves no real ads.
export const AD_DEMO_MODE = true;

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

// Right rail: the candidate pool for the (up to two) rail containers — every
// unit up to a 336×600 box. createNimbusAd narrows this per slot to the units
// that fit the container's measured box (its snapped width × flex height), since
// NitroPay serves the listed size as-is rather than fitting it to the container.
const RAIL_AD_SIZES = sizesThatFit(336, 600);

// The bottom ad's candidate pool — every unit up to 980×250 (980 is the widest
// unit with real bidding pressure). createNimbusAd narrows it to what fits the
// container's measured box (its width is capped at 980, see layout.css).
const BOTTOM_AD_SIZES = sizesThatFit(980, 250);

// --- Slot inventory ---

// The rail shows wherever the content grid opens a right gutter (>= 1214px; see
// layout.css). The rail's width (snapped to a standard ad width) and height are
// set in CSS, and createNimbusAd passes only the fitting sizes, so a single
// mediaQuery suffices — no per-width/height regimes. MUST mirror the rail-hide
// breakpoint in layout.css.
const RAIL_MQ = "(min-width: 1214px)";

// The page-level floating video id ends with this suffix (see FLOATING_VIDEO_ID).
// It's excluded from onNavigate refreshes (see onNavigateNimbusAds) so an
// in-progress impression isn't torn down on every route change — the floating
// player persists across navigations.
const RAIL_VIDEO_ID_SUFFIX = "-video";

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
  onNavigateMin?: number;
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
      onNavigateMin: slot.onNavigateMin ?? ON_NAVIGATE_MIN,
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
// layout.css matches slots by their version-independent substring, not the
// prefix. v3: the rail became two containers (ids -rail-1/-rail-2) whose width
// snaps to a standard ad width and whose sizes are fitted per slot, replacing
// the old per-config fixed slots.
const AD_SLOT_VERSION = 3;
const AD_PREFIX = `nimbus-v${AD_SLOT_VERSION}`;

// Single page-level floating video (NitroPay `floating` format): docks to a
// viewport corner rather than living in the rail, so it's created once (not per
// rail config) and has no width/height gating — its container is a plain empty
// div (see FLOATING_VIDEO_ID in root.tsx), not a reserved-box AdContainer. Re-
// enabled (TS-3954) after NitroPay blocked the rubiconproject requests. The id
// ends in `-video` so onNavigateNimbusAds leaves an in-progress impression alone
// across navigations.
export const FLOATING_VIDEO_ID = `${AD_PREFIX}-floating-video`;

const FLOATING_VIDEO_OPTIONS: NitroAdOptions = {
  format: "floating",
  demo: AD_DEMO_MODE,
  refreshLimit: 0,
  // 30s auto-refresh for the video (display slots use 60s).
  refreshTime: 30,
  onNavigateMin: ON_NAVIGATE_MIN,
  // Dock to the bottom-right corner (NitroPay's default, set explicitly to match
  // the placement spec); smaller player on phones so it doesn't dominate.
  floating: { position: "right", reduceMobileSize: true },
  report: { ...TOP_LEFT_REPORT, icon: true },
};

// Up to two rail containers (ids -rail-1, -rail-2). layout.css snaps their width
// to a standard ad width, makes -rail-1 grow to 600px before -rail-2 appears,
// reserves the floating-video height at the bottom, and drops -rail-2 when the
// rail is too short. createNimbusAd narrows RAIL_AD_SIZES to each container's
// measured box before createAd, so NitroPay can only serve a fitting unit.
export const RIGHT_COLUMN_SLOTS: RenderedAdSlot[] = [
  displaySlot({
    containerId: `${AD_PREFIX}-rail-1`,
    sizeVariant: "dynamic",
    sizes: RAIL_AD_SIZES,
    mediaQuery: RAIL_MQ,
  }),
  displaySlot({
    containerId: `${AD_PREFIX}-rail-2`,
    sizeVariant: "dynamic",
    sizes: RAIL_AD_SIZES,
    mediaQuery: RAIL_MQ,
  }),
];

// Bottom-row refresh policy (overrides the rail display defaults): a 300s
// auto-refresh timer — unlimited, like the rail's but slower than its 60s — plus
// SPA-navigation refreshes no sooner than 60s after the ad was created/last
// refreshed. render/refreshVisibleOnly are inherited from displaySlot (true in
// production). refreshLimit is omitted so it defaults to 0 (unlimited).
const BOTTOM_AD_REFRESH = {
  refreshTime: 300,
  onNavigateMin: 60000,
} as const;

// A single bottom ad (full-width island between content and footer), centered
// and capped at 980px wide (layout.css). createNimbusAd narrows BOTTOM_AD_SIZES
// to the units that fit the container's measured width before createAd, so no
// per-width slots are needed. Kept as a one-element array so the lifecycle /
// lazy-create helpers stay uniform. Always eligible (min-width: 0).
export const BOTTOM_AD_SLOTS: RenderedAdSlot[] = [
  displaySlot({
    containerId: `${AD_PREFIX}-bottom-ad`,
    sizeVariant: "bottom-banner",
    sizes: BOTTOM_AD_SIZES,
    mediaQuery: "(min-width: 0px)",
    ...BOTTOM_AD_REFRESH,
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

// Slot-creation time; the fallback "creative live since" for a slot that has
// not yet reported a render via the nitroAds.rendered event below.
let adsLiveSince = 0;

// Per-slot timestamp of the last ACTUAL render — the initial render OR any
// refresh, INCLUDING NitroPay's own timer auto-refresh — captured from the
// `nitroAds.rendered` document event (detail.adInfo.adUnitCode is the slot id).
// onNavigateNimbusAds gates on this, so an SPA action can't reload a creative
// NitroPay refreshed under MIN_AD_LIFETIME_MS ago. The old single adsLiveSince
// clock only knew about OUR refreshes, so a timer refresh that landed while the
// user idled, followed by a navigation, churned a too-fresh creative.
const lastRenderedAt = new Map<string, number>();

// When we last issued an onNavigate batch — a coarse guard so two navigations
// in the brief window before the new creative's `rendered` event lands can't
// double-refresh a slot.
let lastNavBatchAt = 0;

// Subscribe once (page lifetime) to NitroPay's render events so lastRenderedAt
// stays current across timer refreshes. Attached before any slot is created.
let renderTrackingAttached = false;
function ensureNimbusRenderTracking(): void {
  if (renderTrackingAttached || typeof document === "undefined") {
    return;
  }
  renderTrackingAttached = true;
  document.addEventListener("nitroAds.rendered", (event: Event) => {
    const adInfo = (event as CustomEvent<{ adInfo?: { adUnitCode?: string } }>)
      .detail?.adInfo;
    if (adInfo && typeof adInfo.adUnitCode === "string") {
      lastRenderedAt.set(adInfo.adUnitCode, Date.now());
    }
  });
}

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

// NitroPay renders whatever size wins the auction at its native dimensions — it
// does NOT measure the container or scale the creative to fit. So restrict a
// slot's `sizes` to the inventory units that actually fit the container as
// currently laid out (measured just before createAd). A later window resize is
// not re-fitted (NitroPay fixes the size at creation); the rail's overflow:hidden
// keeps a now-too-big creative from breaking the layout until the next reload.
function fittingSizes(containerId: string, candidates: string[][]): string[][] {
  if (typeof document === "undefined") {
    return candidates;
  }
  const mount = document.getElementById(containerId);
  if (!mount) {
    return candidates;
  }
  const { width, height } = mount.getBoundingClientRect();
  if (width <= 0 || height <= 0) {
    return candidates;
  }
  const fit = candidates.filter(
    ([w, h]) => Number(w) <= width && Number(h) <= height
  );
  // Keep the full list if nothing fits (shouldn't happen — the smallest unit is
  // 88×31) rather than create a slot with no sizes.
  return fit.length > 0 ? fit : candidates;
}

function createNimbusAd(
  nitroAds: NitroAds,
  containerId: string,
  options: NitroAdOptions
): void {
  const generation = adGeneration;
  // Pass only the sizes that fit the measured container (the floating video has
  // no `sizes`). NitroPay serves the listed size as-is, so this is what keeps
  // ads from overflowing their slot.
  const fittedOptions: NitroAdOptions =
    "sizes" in options
      ? { ...options, sizes: fittingSizes(containerId, options.sizes) }
      : options;
  try {
    // createAd may return synchronously or as a promise (per the docs). Capture
    // the NitroAd ref so we can drive onNavigate on client-side navigation.
    Promise.resolve(nitroAds.createAd(containerId, fittedOptions))
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
 * the viewport (see createNimbusAdsInView). The single floating video is created
 * eagerly too (it's page-level, no width/height gate).
 */
export function createAllNimbusAds(nitroAds: NitroAds): void {
  // Track renders (incl. timer refreshes) before any slot is created.
  ensureNimbusRenderTracking();
  adsLiveSince = Date.now();

  for (const slot of RIGHT_COLUMN_SLOTS) {
    createNimbusAd(nitroAds, slot.containerId, slot.options);
  }
  createNimbusAd(nitroAds, FLOATING_VIDEO_ID, FLOATING_VIDEO_OPTIONS);
  createNimbusAdsInView(nitroAds, BOTTOM_AD_SLOTS);
}

/**
 * Tell NitroPay a new pageview happened (SPA navigation): refresh each live slot
 * whose current creative has been on screen at least MIN_AD_LIFETIME_MS. Called
 * from the root layout for the key pageview-like actions — route changes plus
 * search/filter/pagination (query string) changes. Each slot's age comes from
 * the nitroAds.rendered event (lastRenderedAt), so this also respects NitroPay's
 * own timer refreshes: a navigation right after a timer refresh no longer
 * reloads the just-refreshed creative. Excludes the floating video so an
 * in-progress video impression isn't torn down on route change.
 */
export function onNavigateNimbusAds(): void {
  const now = Date.now();
  // Coarse batch guard: also covers the brief window before a fresh `rendered`
  // event updates lastRenderedAt, so back-to-back navigations can't double-fire.
  if (now - lastNavBatchAt < MIN_AD_LIFETIME_MS) {
    return;
  }
  let issued = false;
  adRegistry.forEach((ad, id) => {
    if (id.endsWith(RAIL_VIDEO_ID_SUFFIX)) {
      return;
    }
    // Skip a creative that has been on screen — since its last render OR refresh,
    // including NitroPay's own timer auto-refresh — for less than the minimum
    // lifetime. Falls back to the creation time for a slot that has not reported
    // a render yet.
    const renderedAt = lastRenderedAt.get(id) ?? adsLiveSince;
    if (now - renderedAt < MIN_AD_LIFETIME_MS) {
      return;
    }
    try {
      ad.onNavigate();
      issued = true;
    } catch {
      // Slot may be mid-initialization; ignore.
    }
  });
  if (issued) {
    lastNavBatchAt = now;
  }
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
  // Drop stale per-slot render times + the batch guard; recreated slots report
  // fresh renders. (The render-event listener stays attached for the page.)
  lastRenderedAt.clear();
  lastNavBatchAt = 0;
  // Stop watching not-yet-created bottom slots so a pending lazy createAd can't
  // fire against a torn-down container after unmount.
  adInViewObserver?.disconnect();
  adInViewObserver = undefined;
  pendingInViewSlots.clear();
}
