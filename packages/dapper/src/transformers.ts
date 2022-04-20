/**
 * Collection of shared methods used to transform the data received from
 * the backend to format easily consumed by the apps.
 */
import { PackageCardProps, SelectOption } from "@thunderstore/components";
import { z } from "zod";

import { packageCardSchema, packageCategorySchema } from "./schemas";

export const transformCategories = (
  categories: z.infer<typeof packageCategorySchema>[]
): SelectOption[] => categories.map((c) => ({ value: c.slug, label: c.name }));

export const transformPackageCards = (
  packages: z.infer<typeof packageCardSchema>[]
): PackageCardProps[] =>
  packages.map((p) => ({
    categories: transformCategories(p.categories),
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
