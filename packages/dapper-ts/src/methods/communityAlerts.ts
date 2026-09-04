import { fetchCommunityAlerts } from "@thunderstore/thunderstore-api";

import type { DapperTsInterface } from "../index";

export async function getCommunityAlerts(
  this: DapperTsInterface,
  communityId: string
) {
  const data = await fetchCommunityAlerts({
    config: this.config,
    params: { community_id: communityId },
    data: {},
    queryParams: {},
  });

  return data;
}
