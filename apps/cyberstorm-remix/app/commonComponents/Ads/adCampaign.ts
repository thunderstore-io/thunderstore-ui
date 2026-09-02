import type {
  AdContainerSizeVariant,
  AdCreative,
} from "@thunderstore/cyberstorm";

export interface AdCampaignPlacement {
  campaignId: string;
  href: string;
}

export interface AdCampaign {
  name: string;
  // Each entry and everything beneath it, matched by path segment: "/c/valheim"
  // claims "/c/valheim/p/..." but not "/c/valheim-2".
  paths: readonly string[];
  alt: string;
  // Keyed by adPlacementKey(containerId), e.g.
  // "nimbus-v2-community-sidebar-300x250" -> "community-sidebar". A placement
  // that is missing serves nothing; it does not fall back to the ad network.
  placements: Readonly<Record<string, AdCampaignPlacement>>;
  // Most specific first. Every entry bar the last carries a `media` condition,
  // and the last is the <img> a <picture> falls back to, so it has to suit the
  // narrowest box that shape can take.
  creatives: Readonly<
    Partial<Record<AdContainerSizeVariant, readonly AdCreative[]>>
  >;
}

const IMAGE_ROOT = "/cyberstorm-static/images";

// WebP only: the <img> above has to resolve on its own, so there is no second
// format behind it.
export function creative(
  basename: string,
  width: number,
  height: number
): AdCreative {
  return { src: `${IMAGE_ROOT}/${basename}.webp`, width, height };
}

export function when(media: string, artwork: AdCreative): AdCreative {
  return { ...artwork, media };
}

// Where a slot's box changes size; mirrors layout.css.
export const SLOT_MEDIA = {
  // The bottom row is capped at 980 wide and reaches it at a 1014px viewport.
  bottomRowFits980: "(min-width: 1014px)",
  // --ad-gutter-min steps up to a 300-wide rail at 1880px; below that the rail
  // is 120/160/180 wide, and below 1700px it is hidden.
  railIs300Wide: "(min-width: 1880px)",
} as const;
