import { faker } from "@faker-js/faker";

import { getFakeImg, getIds, setSeed } from "./utils";
import { Community } from "@thunderstore/dapper/types";

const getFakeCommunityPreview = (uuid: string): Community => {
  setSeed(uuid);

  return {
    name: faker.word.words(3),
    identifier: uuid,
    description: faker.helpers.maybe(() => faker.word.words(5)) ?? null,
    discord_url: faker.helpers.maybe(() => faker.internet.url()) ?? null,
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

export const getFakeCommunity = async (uuid: string) => {
  setSeed(uuid);

  return {
    community: {
      ...getFakeCommunityPreview(uuid),
      description: faker.lorem.paragraphs(3),
      discord_url: faker.internet.url(),
      background_image_url: getFakeImg(1920, 1080),
    },
    servers: [],
  };
};

export const getFakeCommunities = async (page = 1, pageSize = 100) => {
  // Last page is not full.
  const fullPages = 5;
  const communityCount = pageSize * fullPages + Math.floor(pageSize / 2);
  const allIds = getIds(communityCount, "communitySeed");
  const pageIds = allIds.splice((page - 1) * pageSize, pageSize);

  return {
    count: communityCount,
    hasMore: page > fullPages + 1,
    results: pageIds.map(getFakeCommunityPreview),
  };
};
