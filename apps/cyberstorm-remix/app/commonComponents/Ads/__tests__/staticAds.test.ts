import { describe, expect, it } from "vitest";

import { type AdCampaign, SLOT_MEDIA, creative, when } from "../adCampaign";
import { CAMPAIGNS } from "../campaigns";
import {
  BOTTOM_AD_SLOTS,
  COMMUNITY_RAIL_SLOTS,
  COMMUNITY_SIDEBAR_AD,
  DEPENDANTS_SIDEBAR_AD,
  PACKAGE_RAIL_SLOTS,
  PACKAGE_SIDEBAR_AD,
  type RenderedAdSlot,
  TEAM_SIDEBAR_AD,
  adPlacementKey,
} from "../nitroAds";
import {
  findCampaign,
  isStaticAdPath,
  resolveStaticAd,
  staticAdForSlot,
} from "../staticAds";

// Fixture, so the rules can be exercised with nothing live.
const WIDE = creative("wide", 980, 250);
const NARROW = creative("narrow", 300, 250);

const FIXTURE: AdCampaign = {
  name: "fixture",
  paths: ["/c/somegame"],
  alt: "An advert",
  placements: {
    "content-bottom": { campaignId: "fixture-bottom", href: "https://x/1" },
    "community-sidebar": { campaignId: "fixture-sidebar", href: "https://x/2" },
  },
  creatives: {
    "bottom-banner": [when(SLOT_MEDIA.bottomRowFits980, WIDE), NARROW],
    "display-300-250": [NARROW],
  },
};

const railTier = (size: string) => {
  const slot = COMMUNITY_RAIL_SLOTS.find((s) => s.sizeVariant === size);
  if (!slot) throw new Error(`no ${size} tier`);
  return slot;
};

describe("commonComponents.Ads.findCampaign", () => {
  it("claims a prefix and everything beneath it", () => {
    for (const p of [
      "/c/somegame",
      "/c/somegame/",
      "/c/somegame/p/Team/Package/",
      "/c/somegame/p/Team",
    ]) {
      expect(findCampaign([FIXTURE], p)).toBe(FIXTURE);
    }
  });

  it("leaves every other route to the ad network", () => {
    for (const p of ["/", "/communities", "/c/other", "/c/some", "/p/x"]) {
      expect(findCampaign([FIXTURE], p)).toBeUndefined();
    }
  });

  it("matches whole path segments only", () => {
    // "/c/test" must not claim "/c/test-community-1".
    for (const p of ["/c/somegame-2", "/c/somegames", "/c/somegame-2/p/a"]) {
      expect(findCampaign([FIXTURE], p)).toBeUndefined();
    }
  });

  it("takes the first campaign that matches", () => {
    const second = { ...FIXTURE, name: "second" };
    expect(findCampaign([FIXTURE, second], "/c/somegame")).toBe(FIXTURE);
  });

  it("matches nothing when no campaign is live", () => {
    expect(findCampaign([], "/c/somegame")).toBeUndefined();
  });
});

describe("commonComponents.Ads.resolveStaticAd", () => {
  it("gives a placement its own click-through and the campaign's alt", () => {
    const ad = resolveStaticAd(FIXTURE, BOTTOM_AD_SLOTS[0]);
    expect(ad?.campaignId).toBe("fixture-bottom");
    expect(ad?.href).toBe("https://x/1");
    expect(ad?.alt).toBe(FIXTURE.alt);
  });

  it("serves nothing for a placement the campaign has no link for", () => {
    // "package-sidebar" is absent; its display-300-250 artwork is not.
    expect(resolveStaticAd(FIXTURE, PACKAGE_SIDEBAR_AD)).toBeUndefined();
  });

  it("serves nothing for a shape with an empty artwork list", () => {
    // "content-bottom" is present, so only the empty list can fail this.
    const optedOut = {
      ...FIXTURE,
      creatives: { ...FIXTURE.creatives, "bottom-banner": [] },
    };
    expect(resolveStaticAd(optedOut, BOTTOM_AD_SLOTS[0])).toBeUndefined();
  });

  it("passes the artwork through most-specific first", () => {
    const ad = resolveStaticAd(FIXTURE, BOTTOM_AD_SLOTS[0]);
    expect(ad?.creatives.map((c) => [c.width, c.media])).toEqual([
      [980, SLOT_MEDIA.bottomRowFits980],
      [300, undefined],
    ]);
  });

  it("leaves a single-shape slot unconditional", () => {
    const ad = resolveStaticAd(FIXTURE, COMMUNITY_SIDEBAR_AD);
    expect(ad?.creatives).toHaveLength(1);
    expect(ad?.creatives[0].media).toBeUndefined();
  });
});

describe("commonComponents.Ads.campaigns", () => {
  it("serves nothing on a path no live campaign claims", () => {
    for (const slot of [
      BOTTOM_AD_SLOTS[0],
      COMMUNITY_SIDEBAR_AD,
      railTier("rail-300x600"),
    ] as RenderedAdSlot[]) {
      expect(staticAdForSlot(slot, "/c/riskofrain2")).toBeUndefined();
      expect(staticAdForSlot(slot, "/communities")).toBeUndefined();
    }
  });

  it("takes over the paths a live campaign claims", () => {
    expect(isStaticAdPath("/c/test")).toBe(true);
    expect(isStaticAdPath("/c/test/p/Team/Package")).toBe(true);
    expect(isStaticAdPath("/c/test-community-1")).toBe(false);
    expect(
      staticAdForSlot(BOTTOM_AD_SLOTS[0], "/c/test")?.creatives.length
    ).toBeGreaterThan(0);
    expect(staticAdForSlot(COMMUNITY_SIDEBAR_AD, "/c/test")?.href).toBeTruthy();
  });

  it("keeps every live campaign well-formed", () => {
    const slotKeys = new Set(
      [
        ...COMMUNITY_RAIL_SLOTS,
        ...PACKAGE_RAIL_SLOTS,
        ...BOTTOM_AD_SLOTS,
        COMMUNITY_SIDEBAR_AD,
        PACKAGE_SIDEBAR_AD,
        TEAM_SIDEBAR_AD,
        DEPENDANTS_SIDEBAR_AD,
      ].map((slot) => adPlacementKey(slot.containerId))
    );

    for (const campaign of CAMPAIGNS) {
      expect(campaign.paths.length).toBeGreaterThan(0);
      expect(campaign.alt).toBeTruthy();
      expect(Object.keys(campaign.placements).length).toBeGreaterThan(0);
      for (const key of Object.keys(campaign.placements)) {
        // A key no slot derives is a typo that silently serves nothing.
        expect([...slotKeys], key).toContain(key);
      }
      for (const [size, list] of Object.entries(campaign.creatives)) {
        if (!list?.length) {
          continue;
        }
        // Every entry bar the last is a <source>; an ungated one shadows the
        // rest of the list on every viewport.
        for (const c of list.slice(0, -1)) {
          expect(c.media, size).toBeTruthy();
        }
        expect(list[list.length - 1].media, size).toBeUndefined();
        for (const c of list) {
          expect(c.src).toMatch(/^\/cyberstorm-static\/images\/.+\.webp$/);
        }
      }
    }
  });
});
