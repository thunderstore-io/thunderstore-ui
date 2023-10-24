import { z } from "zod";
import {
  fetchCommunity,
  fetchCommunityList,
} from "@thunderstore/thunderstore-api";

import { DapperTsInterface } from "../index";
import { PackageCategory, paginatedResults } from "../sharedSchemas";

const communitySchema = z.object({
  name: z.string().nonempty(),
  identifier: z.string().nonempty(),
  description: z.string().nullable(),
  discord_url: z.string().nullable(),
  datetime_created: z.string().datetime(),
  background_image_url: z.string().url().nullable(),
  icon_url: z.string().url().nullable(),
  total_download_count: z.number().int(),
  total_package_count: z.number().int(),
});

const communitiesSchema = paginatedResults(communitySchema);

export async function getCommunities(
  this: DapperTsInterface,
  page = 1,
  ordering = "name",
  search?: string
) {
  const data = await fetchCommunityList(this.config, page, ordering, search);
  const parsed = communitiesSchema.safeParse(data);

  if (!parsed.success) {
    // TODO: add Sentry support and log parsed.error.
    throw new Error("Invalid data received from backend");
  }

  return {
    count: parsed.data.count,
    hasMore: Boolean(parsed.data.next),
    results: parsed.data.results,
  };
}

const communityDetailsSchema = communitySchema.extend({
  package_categories: PackageCategory.array(),
});

export async function getCommunity(
  this: DapperTsInterface,
  communityId: string
) {
  const data = await fetchCommunity(this.config, communityId);
  const parsed = communityDetailsSchema.safeParse(data);

  if (!parsed.success) {
    // TODO: add Sentry support and log parsed.error.
    throw new Error("Invalid data received from backend");
  }

  return parsed.data;
}
