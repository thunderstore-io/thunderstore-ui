import { PackageCardProps } from "@thunderstore/components";

import { categoriesToSelectOptions, Category } from "./category";

export interface BackendPackageCard {
  categories: Category[];
  community_name: string;
  community_identifier: string;
  description: string;
  download_count: number;
  image_src: string | null;
  is_deprecated: boolean;
  is_nsfw: boolean;
  is_pinned: boolean;
  last_updated: string;
  package_name: string;
  rating_score: number;
  team_name: string;
}

// Transform data received from backend to format used by PackageCard component.
export const packageCardsToProps = (
  packages: BackendPackageCard[]
): PackageCardProps[] =>
  packages.map((p) => ({
    categories: categoriesToSelectOptions(p.categories),
    communityIdentifier: p.community_identifier,
    description: p.description,
    downloadCount: p.download_count,
    imageSrc: p.image_src,
    isDeprecated: p.is_deprecated,
    isNsfw: p.is_nsfw,
    isPinned: p.is_pinned,
    lastUpdated: p.last_updated,
    ratingScore: p.rating_score,
    packageName: p.package_name,
    teamName: p.team_name,
  }));
