import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, type NavigateFunction, useNavigate } from "react-router";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { SidebarAd } from "../SidebarAd";
import {
  COMMUNITY_RAIL_SLOTS,
  COMMUNITY_SIDEBAR_AD,
  type NitroAds,
  markNitroAdsReady,
} from "../nitroAds";

(globalThis as unknown as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT =
  true;

const createAd = vi.fn();

let container: HTMLDivElement | undefined;
let root: ReturnType<typeof createRoot> | undefined;
let idle: typeof window.requestIdleCallback;
let navigate: NavigateFunction | undefined;

function NavigationProbe() {
  navigate = useNavigate();
  return null;
}

beforeAll(() => {
  markNitroAdsReady({ createAd } as unknown as NitroAds);
  // The component defers creation to idle; run it inline so one act() flush
  // settles the whole chain.
  idle = window.requestIdleCallback;
  window.requestIdleCallback = ((cb: IdleRequestCallback) => {
    cb({ didTimeout: true, timeRemaining: () => 0 });
    return 1;
  }) as typeof window.requestIdleCallback;
});

afterAll(() => {
  window.requestIdleCallback = idle;
});

afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
  container = undefined;
  root = undefined;
  navigate = undefined;
  createAd.mockClear();
});

async function renderAt(pathname: string, slot = COMMUNITY_SIDEBAR_AD) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => {
    root?.render(
      createElement(
        MemoryRouter,
        { initialEntries: [pathname] },
        createElement(SidebarAd, { slot }),
        createElement(NavigationProbe)
      )
    );
  });
  return container.querySelector<HTMLElement>(".ad-container")!;
}

async function go(to: string, options?: { replace?: boolean }) {
  await act(async () => {
    await navigate?.(to, options);
  });
}

const mountOf = (slot = COMMUNITY_SIDEBAR_AD) =>
  document.getElementById(slot.containerId);

describe("commonComponents.Ads.SidebarAd", () => {
  it("auctions the slot on a path no campaign claims", async () => {
    await renderAt("/c/riskofrain2");
    expect(createAd).toHaveBeenCalledWith(
      COMMUNITY_SIDEBAR_AD.containerId,
      expect.anything()
    );
  });

  it("paints the campaign's artwork instead on a claimed path", async () => {
    const slot = await renderAt("/c/test");
    expect(createAd).not.toHaveBeenCalled();
    expect(slot.querySelector(".ad-container__static")).not.toBeNull();
  });

  it("still auctions nothing where the campaign has no artwork", async () => {
    const bare = COMMUNITY_RAIL_SLOTS.find(
      (s) => s.sizeVariant === "rail-300x100"
    )!;
    const slot = await renderAt("/c/test", bare);
    expect(createAd).not.toHaveBeenCalled();
    expect(slot.querySelector(".ad-container__static")).toBeNull();
  });

  it("creates a new ad in a fresh mount on a page change, keeping the placement", async () => {
    const placement = await renderAt("/c/riskofrain2");
    const firstMount = mountOf();

    await go("/c/riskofrain2?page=2");

    expect(createAd).toHaveBeenCalledTimes(2);
    expect(mountOf()).not.toBe(firstMount);
    expect(firstMount?.isConnected).toBe(false);
    expect(container?.querySelector(".ad-container")).toBe(placement);
  });

  it("keeps the ad when the search or filters change", async () => {
    await renderAt("/c/riskofrain2");
    const mount = mountOf();

    await go("/c/riskofrain2?search=valheim", { replace: true });
    await go("/c/riskofrain2?search=valheim&includedCategories=1");

    expect(createAd).toHaveBeenCalledTimes(1);
    expect(mountOf()).toBe(mount);
  });

  it("frees the network ad when a campaign takes the slot over", async () => {
    await renderAt("/c/riskofrain2");
    const networkMount = mountOf();

    await go("/c/test");

    expect(networkMount?.isConnected).toBe(false);
    expect(createAd).toHaveBeenCalledTimes(1);
    expect(mountOf()?.querySelector(".ad-container__static")).not.toBeNull();
  });

  it("keeps the house fallback off a directly-sold slot with no artwork", async () => {
    // A rectangle the campaign declares no placement for: it will never fill,
    // so the "support us via ads" plea would sit there for the whole flight.
    const uncovered = {
      ...COMMUNITY_SIDEBAR_AD,
      containerId: "nimbus-v2-nowhere-sidebar-300x250",
    };
    const slot = await renderAt("/c/test", uncovered);
    expect(slot.querySelector(".ad-container__static")).toBeNull();
    expect(slot.querySelector(".ad-container__fallback")).toBeNull();
  });
});
