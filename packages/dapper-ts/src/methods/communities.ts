import {
  fetchCommunity,
  fetchCommunityList,
} from "@thunderstore/thunderstore-api";

import { DapperTsInterface } from "../index";
import { formatErrorMessage } from "../utils";

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
