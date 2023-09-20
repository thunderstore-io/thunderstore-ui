import { z } from "zod";
import { fetchCommunityList } from "@thunderstore/thunderstore-api";

import { DapperTsInterface } from "../index";
import { paginatedResults } from "../sharedSchemas";

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

const schema = paginatedResults(communitySchema);

export async function getCommunities(
  this: DapperTsInterface,
  page = 1,
  ordering = "name",
  search?: string
) {
  const data = await fetchCommunityList(this.config, page, ordering, search);
  const parsed = schema.safeParse(data);

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
