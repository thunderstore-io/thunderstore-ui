import { type AdCampaign, SLOT_MEDIA, creative, when } from "../adCampaign";

// "test" exists on thunderstore.dev but not in production.

const BILLBOARD_980X250 = creative("test_campaign_980x250", 980, 250);
const RECTANGLE_300X250 = creative("test_campaign_300x250", 300, 250);
const SKYSCRAPER_160X600 = creative("test_campaign_160x600", 160, 600);
const SKYSCRAPER_300X600 = creative("test_campaign_300x600", 300, 600);

const placement = (position: string) => ({
  campaignId: `test-campaign-${position}`,
  href: "https://thunderstore.dev/c/test/",
});

export const TEST_CAMPAIGN: AdCampaign = {
  name: "test-campaign",
  paths: ["/c/test"],
  alt: "Test campaign placeholder",

  placements: {
    "content-bottom": placement("bottom"),
    "community-rail": placement("community-rail"),
    "package-rail": placement("package-rail"),
    "community-sidebar": placement("community-sidebar"),
    "package-sidebar": placement("package-sidebar"),
    "team-sidebar": placement("team-sidebar"),
    "dependants-sidebar": placement("dependants-sidebar"),
  },

  creatives: {
    "bottom-banner": [
      when(SLOT_MEDIA.bottomRowFits980, BILLBOARD_980X250),
      RECTANGLE_300X250,
    ],
    "display-300-250": [RECTANGLE_300X250],
    "rail-300x600": [
      when(SLOT_MEDIA.railIs300Wide, SKYSCRAPER_300X600),
      SKYSCRAPER_160X600,
    ],
    "rail-300x250": [RECTANGLE_300X250],
  },
};
