import { type AdCampaign, SLOT_MEDIA, creative, when } from "../adCampaign";

const BILLBOARD_980X250 = creative("valheim_1_billboard_980250", 980, 250);
const RECTANGLE_300X250 = creative("valheim_1_content_300250", 300, 250);
const SKYSCRAPER_160X600 = creative("valheim_1_side_rail_160600", 160, 600);
const SKYSCRAPER_300X600 = creative("valheim_1_web_side_rail_300600", 300, 600);

const link = (code: string) =>
  `https://dathost.com/r/thunderstore2026/valheim?c=${code}`;

export const VALHEIM_LAUNCH: AdCampaign = {
  name: "valheim-1-launch",
  paths: ["/c/valheim"],
  alt: "DatHost — Valheim server hosting, first month for one euro",

  // The team and dependants sidebars share the community link: the advertiser
  // supplied one per page family, not per route.
  placements: {
    "content-bottom": {
      campaignId: "valheim-1-launch-nimbus-bottom",
      href: link("079f6603"),
    },
    "community-rail": {
      campaignId: "valheim-1-launch-nimbus-community-rail",
      href: link("1a3d3cca"),
    },
    "package-rail": {
      campaignId: "valheim-1-launch-nimbus-package-rail",
      href: link("8b88a296"),
    },
    "community-sidebar": {
      campaignId: "valheim-1-launch-nimbus-community-sidebar",
      href: link("7627c24f"),
    },
    "package-sidebar": {
      campaignId: "valheim-1-launch-nimbus-package-sidebar",
      href: link("7d257dcd"),
    },
    "team-sidebar": {
      campaignId: "valheim-1-launch-nimbus-community-sidebar",
      href: link("7627c24f"),
    },
    "dependants-sidebar": {
      campaignId: "valheim-1-launch-nimbus-community-sidebar",
      href: link("7627c24f"),
    },
  },

  creatives: {
    // Scaled down, the billboard is an ~87px strip in a 250px box.
    "bottom-banner": [
      when(SLOT_MEDIA.bottomRowFits980, BILLBOARD_980X250),
      RECTANGLE_300X250,
    ],
    "display-300-250": [RECTANGLE_300X250],
    "rail-300x600": [
      when(SLOT_MEDIA.railIs300Wide, SKYSCRAPER_300X600),
      SKYSCRAPER_160X600,
    ],
    // Nothing for the 100px tier: no artwork is anywhere near 300x100.
    "rail-300x250": [RECTANGLE_300X250],
  },
};
