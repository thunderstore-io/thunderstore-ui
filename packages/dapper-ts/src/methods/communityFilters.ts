import { fetchCommunityFilters } from "@thunderstore/thunderstore-api";

import { DapperTsInterface } from "../index";

export async function getCommunityFilters(
  this: DapperTsInterface,
  communityId: string
) {
  const data = await fetchCommunityFilters({
    config: this.config,
    params: { community_id: communityId },
    data: {},
    queryParams: {},
  });

  return data;
}
