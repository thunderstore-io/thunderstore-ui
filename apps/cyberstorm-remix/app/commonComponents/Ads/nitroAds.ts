import type { AdContainerSizeVariant } from "@thunderstore/cyberstorm";

/**
 * NitroPay integration config + SPA lifecycle helpers for Nimbus.
 *
 * The ad surface (publisher 785): a DISPLAY side rail, a single page-level
 * floating video, a single bottom banner, and two page-scoped 300×250 sidebar
 * slots (community search + package listing; see SidebarAd /
 * createPageScopedAd). The rail (see `app/styles/
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
 * that docks to a viewport corner — created once, excluded from navigation
 * refreshes. All slot ids must be configured in the NitroPay dashboard before
 * they fill.
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
  // No onNavigateMin: the floating video is excluded from SPA onNavigate
  // refreshes (see onNavigateNimbusAds), so a navigation floor never applies.
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
// 120-180px-snapped rail. Once created, a tier is never re-created — later
// hides/reveals only toggle visibility (render/refreshVisibleOnly).
export const COMMUNITY_RAIL_SLOTS: RenderedAdSlot[] = railSlots("community");
export const PACKAGE_RAIL_SLOTS: RenderedAdSlot[] = railSlots("package");

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
// configured/reported separately in NitroPay. Unlike the layout slots above —
// whose containers live in the root layout and are created once by
// createAllNimbusAds — these containers only exist on their page, so <SidebarAd>
// creates them per-mount (awaiting whenNitroAdsReady) and frees them on unmount.
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

// --- Lifecycle (module-scope so refs survive AdsInit unmount/remount) ---

// Live NitroAd refs, keyed by container id, used to drive onNavigate. AdsInit
// guards createAd to run once per mount (see its `hasCreatedAds` ref), so we do
// not need a separate dedupe set here.
const adRegistry = new Map<string, NitroAd>();

// Bumped on every teardown so createAd resolutions still in flight from a
// previous generation are dropped instead of repopulating the cleared registry
// with refs to slots whose container divs were already unmounted.
let adGeneration = 0;

// Per-container creation epoch for page-scoped sidebar slots. adGeneration only
// covers whole-surface teardown; a single sidebar can unmount (or unmount then
// remount, reusing the same id) without bumping it. createPageScopedAd bumps the
// epoch before each createAd and removePageScopedAd bumps it on unmount, so a
// createAd promise that resolves late is recognized as stale and never registers
// a ref for onNavigate to churn against. Layout slots have no entry here (their
// creation is guarded by adGeneration alone).
const pageScopedEpoch = new Map<string, number>();

function bumpPageScopedEpoch(containerId: string): void {
  pageScopedEpoch.set(containerId, (pageScopedEpoch.get(containerId) ?? 0) + 1);
}

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

// Lazy slot creation: createAd is deferred until the slot's container first
// intersects the viewport (within this margin). For the bottom row that means
// no auction for a slot the user may never scroll to; for the rail tiers it
// guarantees fittingSizes measures a laid-out box — a hidden tier is created
// only once a resize/navigation reveals it. (renderVisibleOnly/
// refreshVisibleOnly only gate NitroPay's render+refresh, not creation.)
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
    // Not laid out (hidden container). Shouldn't happen — lazy slots are
    // created on first reveal — but keep the full list rather than none.
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
  const pageEpoch = pageScopedEpoch.get(containerId);
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
        if (pageScopedEpoch.get(containerId) !== pageEpoch) {
          // A page-scoped slot unmounted — or unmounted and remounted with a
          // newer creation — while this was in flight. Registering now would
          // leave a stale ref for onNavigate to churn against.
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
 * Create each slot lazily, once its container scrolls near the viewport or is
 * first revealed. Slots that are `display: none` for the current breakpoint
 * never intersect, so only the matching one is created (NitroPay's `mediaQuery`
 * is the backstop). Falls back to eager creation when IntersectionObserver is
 * unavailable.
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
 * Create every Nimbus ad slot. The six rail tiers (three heights ×
 * community/package) and the below-the-fold bottom banner are created lazily on
 * their container's first intersection (createNimbusAdsInView): the one visible
 * tier intersects immediately, hidden tiers wait until a resize/navigation
 * reveals them — so fittingSizes always measures a laid-out box and each slot's
 * size pool is narrowed to the real rail width. With AD_DEMO_MODE on, each slot
 * is created with `demo: true` so NitroPay paints its own demo placeholders
 * (NitroPay's demo is unreliable for the larger units / backgrounded tabs). The
 * single floating video is created eagerly (it's page-level, no width/height
 * gate).
 */
export function createAllNimbusAds(nitroAds: NitroAds): void {
  // Track renders (incl. timer refreshes) before any slot is created.
  ensureNimbusRenderTracking();
  adsLiveSince = Date.now();

  createNimbusAdsInView(nitroAds, [
    ...COMMUNITY_RAIL_SLOTS,
    ...PACKAGE_RAIL_SLOTS,
  ]);
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
  // Stop watching not-yet-created lazy slots (rail tiers + bottom row) so a
  // pending createAd can't fire against a torn-down container after unmount.
  adInViewObserver?.disconnect();
  adInViewObserver = undefined;
  pendingInViewSlots.clear();
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
export function whenNitroAdsReady(
  signal?: AbortSignal
): Promise<NitroAds | null> {
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

// --- Page-scoped sidebar ads (created by <SidebarAd> per-mount) ---

// Forget one slot's refs after its container div unmounts. React removes the
// `#id` div and NitroPay frees the slot, so this just drops our refs (registry +
// render clock) — unlike teardownNimbusAds it neither bumps the generation nor
// clears the whole surface, since only this one slot went away.
function removeNimbusAd(containerId: string): void {
  adRegistry.delete(containerId);
  lastRenderedAt.delete(containerId);
  pendingInViewSlots.delete(containerId);
}

export function createPageScopedAd(
  nitroAds: NitroAds,
  slot: RenderedAdSlot
): void {
  // Bump BEFORE createNimbusAd captures the epoch, so any older in-flight
  // creation for this id (a fast remount) is invalidated.
  bumpPageScopedEpoch(slot.containerId);
  createNimbusAd(nitroAds, slot.containerId, slot.options);
}

export function removePageScopedAd(slot: RenderedAdSlot): void {
  // Invalidate any still-in-flight createAd for this id (see createNimbusAd).
  bumpPageScopedEpoch(slot.containerId);
  removeNimbusAd(slot.containerId);
}
