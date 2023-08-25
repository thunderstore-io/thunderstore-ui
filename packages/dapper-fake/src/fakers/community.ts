import { faker } from "@faker-js/faker";

import { getFakeImg, getIds, setSeed } from "./utils";

const getFakeCommunityPreview = (uuid: string) => {
  setSeed(uuid);

  return {
    identifier: uuid,
    name: faker.word.words(3),
    total_download_count: faker.number.int({ min: 1000000, max: 10000000 }),
    total_package_count: faker.number.int({ min: 0, max: 100000 }),
    total_server_count: faker.number.int({ min: 0, max: 1000 }),
    portrait_image_url: getFakeImg(300, 450),
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

export const getFakeCommunities = () =>
  Promise.all(getIds(20).map(getFakeCommunityPreview));
