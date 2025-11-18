import {
  CommunityListOrderingEnum,
  fetchCommunity,
  fetchCommunityList,
} from "@thunderstore/thunderstore-api";

import { DapperTsInterface } from "../index";

export function getCommunities(
  this: DapperTsInterface,
  page?: number,
  ordering?: string,
  search?: string
) {
  let supportedOrdering = undefined;
  // As dapper accepts more options, than the TS api at this time, we'll need to check if the given ordering is supported.
  if (
    ordering &&
    Object.values(CommunityListOrderingEnum).includes(
      ordering as CommunityListOrderingEnum
    )
  ) {
    supportedOrdering = ordering as CommunityListOrderingEnum;
  }
  return fetchCommunityList({
    config: this.config,
    queryParams: [
      { key: "page", value: page, impotent: 1 },
      {
        key: "ordering",
        value: supportedOrdering,
        impotent: CommunityListOrderingEnum.Name,
      },
      { key: "search", value: search },
    ],
    params: {},
    data: {},
  });
}

export function getCommunity(this: DapperTsInterface, communityId: string) {
  return fetchCommunity({
    config: this.config,
    params: { community_id: communityId },
    data: {},
    queryParams: {},
  });
}
