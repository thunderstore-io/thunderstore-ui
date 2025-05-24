import { z } from "zod";

export const pageQueryParam = z.object({
  key: z.literal("page"),
  value: z.number().int().optional(),
  impotent: z.number().int(),
});

export const searchQueryParam = z.object({
  key: z.literal("search"),
  value: z.string().optional(),
});

export enum CommunityListOrderingEnum {
  Name = "name",
  Latest = "-datetime_created",
  Popular = "-aggregated_fields__package_count",
  MostDownloads = "-aggregated_fields__download_count",
}

export const communityListOrderingQueryParam = z.object({
  key: z.literal("ordering"),
  value: z.nativeEnum(CommunityListOrderingEnum).optional(),
  impotent: z.nativeEnum(CommunityListOrderingEnum),
});

export const communityListQueryParams = z.object({
  page: pageQueryParam,
  search: searchQueryParam,
  ordering: communityListOrderingQueryParam,
});

export const includedCategoriesQueryParam = z.object({
  key: z.literal("included_categories"),
  value: z.array(z.string()).optional(),
});

export const excludedCategoriesQueryParam = z.object({
  key: z.literal("excluded_categories"),
  value: z.array(z.string()).optional(),
});

export const sectionQueryParam = z.object({
  key: z.literal("section"),
  value: z.string().optional(),
});

export const nsfwQueryParam = z.object({
  key: z.literal("nsfw"),
  value: z.boolean().optional(),
  impotent: z.boolean(),
});

export const deprecatedQueryParam = z.object({
  key: z.literal("deprecated"),
  value: z.boolean().optional(),
  impotent: z.boolean(),
});

export const qQueryParam = z.object({
  key: z.literal("q"),
  value: z.string().optional(),
});

export enum PackageListingsOrderingEnum {
  Created = "newest",
  Downloaded = "most-downloaded",
  Rated = "top-rated",
  Updated = "last-updated",
}

export const packageListingsOrderingQueryParam = z.object({
  key: z.literal("ordering"),
  value: z.nativeEnum(PackageListingsOrderingEnum).optional(),
  impotent: z.nativeEnum(PackageListingsOrderingEnum),
});
