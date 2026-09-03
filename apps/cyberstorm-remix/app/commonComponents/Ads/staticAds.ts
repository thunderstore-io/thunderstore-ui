import type { StaticAd } from "@thunderstore/cyberstorm";

import type { AdCampaign } from "./adCampaign";
import { CAMPAIGNS } from "./campaigns";
import { type RenderedAdSlot, adPlacementKey } from "./nitroAds";

/**
 * Resolves an ad slot against the directly-sold campaigns in ./campaigns. On a
 * path a campaign claims, nothing is bought from the ad network — see the
 * callers in root.tsx and SidebarAd.tsx, which must gate on the same paths.
 */

function claims(path: string, pathname: string): boolean {
  const base = path.endsWith("/") ? path.slice(0, -1) : path;
  return pathname === base || pathname.startsWith(`${base}/`);
}

// Takes the list rather than reading CAMPAIGNS so it is testable with nothing
// live.
export function findCampaign(
  campaigns: readonly AdCampaign[],
  pathname: string
): AdCampaign | undefined {
  return campaigns.find((campaign) =>
    campaign.paths.some((path) => claims(path, pathname))
  );
}

export function resolveStaticAd(
  campaign: AdCampaign,
  slot: RenderedAdSlot
): StaticAd | undefined {
  const placement = campaign.placements[adPlacementKey(slot.containerId)];
  const creatives = campaign.creatives[slot.sizeVariant];
  if (!placement || !creatives || creatives.length === 0) {
    return undefined;
  }
  return {
    href: placement.href,
    alt: campaign.alt,
    campaignId: placement.campaignId,
    creatives: [...creatives],
  };
}

function campaignForPath(pathname: string): AdCampaign | undefined {
  return findCampaign(CAMPAIGNS, pathname);
}

export function isStaticAdPath(pathname: string): boolean {
  return campaignForPath(pathname) !== undefined;
}

export function staticAdForSlot(
  slot: RenderedAdSlot,
  pathname: string
): StaticAd | undefined {
  const campaign = campaignForPath(pathname);
  return campaign ? resolveStaticAd(campaign, slot) : undefined;
}
