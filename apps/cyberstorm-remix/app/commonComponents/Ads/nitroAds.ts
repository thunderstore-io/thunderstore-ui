import * as Sentry from "@sentry/react-router";

import type { AdContainerSizeVariant } from "@thunderstore/cyberstorm";

import { AD_IDLE_TIMEOUT_MS, scheduleWhenIdle } from "./scheduleWhenIdle";

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

export const AD_DEMO_MODE: boolean = false;

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

function sizesThatFit(maxWidth: number, maxHeight: number): string[][] {
  return AD_UNIT_INVENTORY.filter(
    ([width, height]) =>
      Number(width) <= maxWidth && Number(height) <= maxHeight
  );
}

const BOTTOM_AD_SIZES = sizesThatFit(980, 250);

const SIDEBAR_AD_SIZES = sizesThatFit(300, 250);

const RAIL_MQ = "(min-width: 1700px)";

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
      refreshLimit: slot.refreshLimit ?? 0,
      refreshTime: slot.refreshTime ?? 60,
      renderVisibleOnly: !AD_DEMO_MODE,
      refreshVisibleOnly: !AD_DEMO_MODE,
      sizes: slot.sizes,
      report: slot.report ?? DISPLAY_REPORT,
      mediaQuery: slot.mediaQuery,
    },
  };
}

const AD_SLOT_VERSION = 2;
const AD_PREFIX = `nimbus-v${AD_SLOT_VERSION}`;

export function adPlacementKey(containerId: string): string {
  return containerId.replace(/^nimbus-v\d+-/, "").replace(/-\d+x\d+$/, "");
}

export const FLOATING_VIDEO_ID = `${AD_PREFIX}-floating-video`;

const FLOATING_VIDEO_OPTIONS: NitroAdOptions = {
  format: "floating",
  demo: AD_DEMO_MODE,
  refreshLimit: 0,
  refreshTime: 30,
  floating: { position: "right", reduceMobileSize: true },
  report: { ...TOP_LEFT_REPORT, icon: true },
};

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

export const COMMUNITY_RAIL_SLOTS: RenderedAdSlot[] = railSlots("community");
export const PACKAGE_RAIL_SLOTS: RenderedAdSlot[] = railSlots("package");

const BOTTOM_AD_REFRESH = {
  refreshTime: 300,
} as const;

export const BOTTOM_AD_SLOTS: RenderedAdSlot[] = [
  displaySlot({
    containerId: `${AD_PREFIX}-content-bottom-980x250`,
    sizeVariant: "bottom-banner",
    sizes: BOTTOM_AD_SIZES,
    mediaQuery: "(min-width: 0px)",
    ...BOTTOM_AD_REFRESH,
  }),
];

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
