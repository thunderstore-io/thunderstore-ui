import {
  CommunityListOrderingEnum,
  fetchCommunity,
  fetchCommunityList,
} from "@thunderstore/thunderstore-api";

import type { DapperTsInterface } from "../index";

/** Returns all communities matching the filters unless a specific page is requested. */
export async function getCommunities(
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
  const fetchPage = (page?: number) =>
    fetchCommunityList({
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

  let data = await fetchPage(page);
  const results = [...data.results];
  for (let nextPage = 2; page === undefined && data.next; nextPage++) {
    data = await fetchPage(nextPage);
    results.push(...data.results);
  }

  return {
    count: data.count,
    hasMore: Boolean(data.next),
    results,
  };
}

export async function getCommunity(
  this: DapperTsInterface,
  communityId: string
) {
  const data = await fetchCommunity({
    config: this.config,
    params: { community_id: communityId },
    data: {},
    queryParams: {},
  });

  return data;
}
