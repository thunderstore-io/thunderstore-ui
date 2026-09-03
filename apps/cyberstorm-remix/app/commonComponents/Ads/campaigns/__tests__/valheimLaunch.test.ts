import { describe, expect, it } from "vitest";

import {
  BOTTOM_AD_SLOTS,
  COMMUNITY_RAIL_SLOTS,
  COMMUNITY_SIDEBAR_AD,
  DEPENDANTS_SIDEBAR_AD,
  PACKAGE_RAIL_SLOTS,
  PACKAGE_SIDEBAR_AD,
  TEAM_SIDEBAR_AD,
} from "../../nitroAds";
import { staticAdForSlot } from "../../staticAds";
import { VALHEIM_LAUNCH } from "../valheimLaunch";

const VALHEIM = "/c/valheim";
const LINK = "https://dathost.com/r/thunderstore2026/valheim";

const railTier = (slots: typeof COMMUNITY_RAIL_SLOTS, size: string) => {
  const slot = slots.find((s) => s.sizeVariant === size);
  if (!slot) throw new Error(`no ${size} tier in the rail inventory`);
  return slot;
};
const COMMUNITY_RAIL_600 = railTier(COMMUNITY_RAIL_SLOTS, "rail-300x600");
const COMMUNITY_RAIL_250 = railTier(COMMUNITY_RAIL_SLOTS, "rail-300x250");
const COMMUNITY_RAIL_100 = railTier(COMMUNITY_RAIL_SLOTS, "rail-300x100");
const PACKAGE_RAIL_600 = railTier(PACKAGE_RAIL_SLOTS, "rail-300x600");

describe("Ads.campaigns.valheimLaunch", () => {
  it("takes over the community and everything nested under it", () => {
    for (const path of [
      "/c/valheim",
      "/c/valheim/",
      "/c/valheim/p/Team/Package/",
      "/c/valheim/p/Team/Package/dependants",
      "/c/valheim/p/Team",
    ]) {
      expect(staticAdForSlot(BOTTOM_AD_SLOTS[0], path)).toBeDefined();
    }
  });

  it("leaves every other community to the ad network", () => {
    for (const path of ["/", "/communities", "/c/riskofrain2", "/c/v"]) {
      expect(staticAdForSlot(BOTTOM_AD_SLOTS[0], path)).toBeUndefined();
    }
  });

  // A separate click-through per position.
  it.each([
    [BOTTOM_AD_SLOTS[0], "valheim-1-launch-nimbus-bottom", "079f6603"],
    [COMMUNITY_RAIL_600, "valheim-1-launch-nimbus-community-rail", "1a3d3cca"],
    [PACKAGE_RAIL_600, "valheim-1-launch-nimbus-package-rail", "8b88a296"],
    [
      COMMUNITY_SIDEBAR_AD,
      "valheim-1-launch-nimbus-community-sidebar",
      "7627c24f",
    ],
    [PACKAGE_SIDEBAR_AD, "valheim-1-launch-nimbus-package-sidebar", "7d257dcd"],
  ])("links %# to its own campaign", (slot, campaignId, code) => {
    const ad = staticAdForSlot(slot, VALHEIM);
    expect(ad?.campaignId).toBe(campaignId);
    expect(ad?.href).toBe(`${LINK}?c=${code}`);
  });

  it("gives the team and dependants sidebars the community campaign", () => {
    // One sidebar link per page family, not per route.
    const community = staticAdForSlot(COMMUNITY_SIDEBAR_AD, VALHEIM);
    for (const slot of [TEAM_SIDEBAR_AD, DEPENDANTS_SIDEBAR_AD]) {
      const ad = staticAdForSlot(slot, VALHEIM);
      expect(ad?.href).toBe(community?.href);
      expect(ad?.campaignId).toBe(community?.campaignId);
    }
  });

  it("gates the bottom row's billboard behind the width it needs", () => {
    const ad = staticAdForSlot(BOTTOM_AD_SLOTS[0], VALHEIM);
    expect(ad?.creatives.map((c) => [c.width, c.height, c.media])).toEqual([
      [980, 250, "(min-width: 1014px)"],
      [300, 250, undefined],
    ]);
  });

  it("gates the rail's 300-wide skyscraper behind the width it needs", () => {
    // The rail is 120/160/180 wide below 1880px.
    const ad = staticAdForSlot(COMMUNITY_RAIL_600, VALHEIM);
    expect(ad?.creatives.map((c) => [c.width, c.height, c.media])).toEqual([
      [300, 600, "(min-width: 1880px)"],
      [160, 600, undefined],
    ]);
  });

  it("falls back to the rectangle on the rail's short tier", () => {
    const ad = staticAdForSlot(COMMUNITY_RAIL_250, VALHEIM);
    expect(ad?.creatives.map((c) => [c.width, c.height])).toEqual([[300, 250]]);
  });

  it("serves nothing on the rail's 100px tier", () => {
    // No supplied artwork is anywhere near 300x100.
    expect(staticAdForSlot(COMMUNITY_RAIL_100, VALHEIM)).toBeUndefined();
  });

  it("covers every placement the campaign routes can render", () => {
    // A slot with no entry serves nothing; it does not fall back to the network.
    for (const slot of [
      BOTTOM_AD_SLOTS[0],
      COMMUNITY_SIDEBAR_AD,
      PACKAGE_SIDEBAR_AD,
      TEAM_SIDEBAR_AD,
      DEPENDANTS_SIDEBAR_AD,
      COMMUNITY_RAIL_600,
      PACKAGE_RAIL_600,
    ]) {
      expect(staticAdForSlot(slot, VALHEIM)).toBeDefined();
    }
  });

  it("ships every creative as a WebP from the static image root", () => {
    for (const list of Object.values(VALHEIM_LAUNCH.creatives)) {
      for (const c of list ?? []) {
        expect(c.src).toMatch(
          /^\/cyberstorm-static\/images\/valheim_1_.+\.webp$/
        );
      }
    }
  });
});
