import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  BOTTOM_AD_SLOTS,
  COMMUNITY_RAIL_SLOTS,
  COMMUNITY_SIDEBAR_AD,
  type NitroAds,
  createNimbusLayoutAds,
  createNimbusPageScopedAd,
  markNitroAdsReady,
} from "../nitroAds";

const createAd = vi.fn();
const nitroAds = { createAd } as unknown as NitroAds;

const idleCallbacks = new Map<number, IdleRequestCallback>();
let nextIdleHandle = 0;

function runIdle() {
  const callbacks = [...idleCallbacks.values()];
  idleCallbacks.clear();
  for (const callback of callbacks) {
    callback({ didTimeout: false, timeRemaining: () => 50 });
  }
}

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

const nextFrames = () =>
  new Promise((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(resolve))
  );

const mounts: HTMLElement[] = [];

function addMount(id: string, style = "width: 300px; height: 250px;") {
  const mount = document.createElement("div");
  mount.id = id;
  mount.setAttribute("style", style);
  document.body.append(mount);
  mounts.push(mount);
  return mount;
}

beforeAll(() => {
  markNitroAdsReady(nitroAds);
});

beforeEach(() => {
  vi.spyOn(window, "requestIdleCallback").mockImplementation((callback) => {
    nextIdleHandle += 1;
    idleCallbacks.set(nextIdleHandle, callback);
    return nextIdleHandle;
  });
  vi.spyOn(window, "cancelIdleCallback").mockImplementation((handle) => {
    idleCallbacks.delete(handle);
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  idleCallbacks.clear();
  createAd.mockClear();
  for (const mount of mounts.splice(0)) {
    mount.remove();
  }
});

describe("commonComponents.Ads.nitroAds page-scoped ads", () => {
  const { containerId } = COMMUNITY_SIDEBAR_AD;

  it("creates the ad in its mount once the browser is idle", async () => {
    addMount(containerId);
    createNimbusPageScopedAd(COMMUNITY_SIDEBAR_AD);
    await settle();
    expect(createAd).not.toHaveBeenCalled();

    runIdle();

    expect(createAd).toHaveBeenCalledWith(containerId, expect.anything());
  });

  it("skips a mount that a newer pageview replaced before creation", async () => {
    const stale = addMount(containerId);
    createNimbusPageScopedAd(COMMUNITY_SIDEBAR_AD);
    await settle();

    stale.replaceWith(addMount(containerId));
    runIdle();

    expect(createAd).not.toHaveBeenCalled();
  });

  it("cancels a creation that hasn't run when cleaned up", async () => {
    addMount(containerId);
    const cleanup = createNimbusPageScopedAd(COMMUNITY_SIDEBAR_AD);
    await settle();

    cleanup();
    runIdle();

    expect(createAd).not.toHaveBeenCalled();
  });
});

describe("commonComponents.Ads.nitroAds layout ads", () => {
  const tallTier = COMMUNITY_RAIL_SLOTS[0];
  const bottom = BOTTOM_AD_SLOTS[0];

  it("creates an in-view ad with only the sizes that fit its mount", async () => {
    addMount(tallTier.containerId, "width: 160px; height: 600px;");
    createNimbusLayoutAds(nitroAds);

    runIdle();

    await vi.waitFor(() => expect(createAd).toHaveBeenCalledTimes(1));
    const [id, options] = createAd.mock.calls[0];
    expect(id).toBe(tallTier.containerId);
    expect(options.sizes).toContainEqual(["160", "600"]);
    for (const [width] of options.sizes) {
      expect(Number(width)).toBeLessThanOrEqual(160);
    }
  });

  it("leaves out-of-view ads until they scroll near the viewport", async () => {
    addMount(
      bottom.containerId,
      "position: absolute; top: 10000px; width: 980px; height: 250px;"
    );
    createNimbusLayoutAds(nitroAds);

    runIdle();
    await nextFrames();

    expect(createAd).not.toHaveBeenCalled();
  });

  it("drops the pageview's pending ads when cleaned up", async () => {
    addMount(tallTier.containerId, "width: 160px; height: 600px;");
    const cleanup = createNimbusLayoutAds(nitroAds);

    runIdle();
    cleanup();
    await nextFrames();

    expect(createAd).not.toHaveBeenCalled();
  });
});
