import { z } from "zod";
import {
  fetchCommunity,
  fetchCommunityList,
} from "@thunderstore/thunderstore-api";

import { DapperTsInterface } from "../index";
import { paginatedResults } from "../sharedSchemas";
import { formatErrorMessage } from "../utils";

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
    throw new Error(formatErrorMessage(parsed.error));
  }

  return {
    count: parsed.data.count,
    hasMore: Boolean(parsed.data.next),
    results: parsed.data.results,
  };
}

export async function getCommunity(
  this: DapperTsInterface,
  communityId: string
) {
  const data = await fetchCommunity(this.config, communityId);
  const parsed = communitySchema.safeParse(data);

  if (!parsed.success) {
    throw new Error(formatErrorMessage(parsed.error));
  }

  return parsed.data;
}
