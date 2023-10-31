import { faker } from "@faker-js/faker";
import { GetCommunities } from "@thunderstore/dapper/types";

import {
  getFakeImg,
  getFakePackageCategories,
  getFakeSections,
  getIds,
  setSeed,
} from "./utils";

export const getFakeCommunity = async (communityId: string) => {
  setSeed(communityId);

  return {
    name: faker.word.words(3),
    identifier: communityId,
    description: faker.helpers.maybe(() => faker.word.words(5)) ?? null,
    discord_url: faker.helpers.maybe(() => faker.internet.url()) ?? null,
    datetime_created: faker.date.past().toISOString(),
    background_image_url:
      faker.helpers.maybe(() => getFakeImg(300, 450), { probability: 0.9 }) ??
      null,
    icon_url:
      faker.helpers.maybe(() => getFakeImg(300, 450), { probability: 0.9 }) ??
      null,
    total_download_count: faker.number.int({ min: 1000000, max: 10000000 }),
    total_package_count: faker.number.int({ min: 0, max: 100000 }),
  };
};

export const getFakeCommunities: GetCommunities = async (
  page = 1,
  ordering = "name",
  search?: string
) => {
  // Last page is not full.
  const pageSize = 150;
  const fullPages = 5;
  const communityCount = pageSize * fullPages + Math.floor(pageSize / 2);
  let communities = await Promise.all(
    getIds(communityCount, "communitySeed").map(getFakeCommunity)
  );

  if (typeof search === "string" && search !== "") {
    const q = search.toLowerCase();
    communities = communities.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
    );
  }

  if (ordering === "datetime_created") {
    communities.sort(
      (a, b) => Date.parse(a.datetime_created) - Date.parse(b.datetime_created)
    );
  } else if (ordering === "-datetime_created") {
    communities.sort(
      (a, b) => Date.parse(b.datetime_created) - Date.parse(a.datetime_created)
    );
  } else if (ordering === "name") {
    communities.sort((a, b) => a.name.localeCompare(b.name));
  } else if (ordering === "-name") {
    communities.sort((a, b) => b.name.localeCompare(a.name));
  }

  const count = communities.length;
  const pageCommunities = communities.splice((page - 1) * pageSize, pageSize);

  return {
    count,
    hasMore: page > fullPages + 1,
    results: pageCommunities,
  };
};

export const getFakeCommunityFilters = async (communityId: string) => {
  setSeed(communityId);

  return {
    package_categories: getFakePackageCategories(11),
    sections: getFakeSections(6),
  };
};
