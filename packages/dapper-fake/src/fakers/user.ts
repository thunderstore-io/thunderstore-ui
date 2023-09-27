import { faker } from "@faker-js/faker";

import { getFakeImg, getFakeLink, setSeed } from "./utils";

export const getFakeCurrentUser = async () => {
  setSeed("currentUser");

  return {
    username: faker.internet.userName(),
    capabilities: ["package.rate"],
    connections: [
      getFakeOAuthConnection("Discord"),
      getFakeOAuthConnection("GitHub"),
      getFakeOAuthConnection("Overwolf"),
    ],
    rated_packages: [],
    subscription: {
      expires:
        faker.helpers.maybe(() =>
          faker.date.soon({ days: 30 }).toDateString()
        ) ?? null,
    },
    teams: [faker.word.words(1), faker.word.words(2)],
  };
};

export const getFakeUser = async (userId?: string) => {
  setSeed(userId);

  return {
    user: getFakeUserBase(),
    packages: [],
    servers: [],
  };
};

export const getFakeUserSettings = async (userId?: string) => {
  setSeed(userId);

  return {
    ...getFakeUserBase(),
    connections: [
      getFakeOAuthConnection("Discord"),
      getFakeOAuthConnection("GitHub"),
    ],
  };
};

const getFakeUserBase = () => ({
  name: faker.internet.userName(),
  imageSource: getFakeImg(),
  description: faker.lorem.paragraphs(12),
  about: faker.lorem.words(16),
  accountCreated: faker.date.recent({ days: 700 }).toDateString(),
  lastActive: faker.date.recent({ days: 700 }).toDateString(),
  dynamicLinks: [getFakeLink(), getFakeLink(), getFakeLink()],

  // TODO: We are missing generated badges and achievements
  showBadgesOnProfile: true,
  showAchievementsOnProfile: true,
});

const getFakeOAuthConnection = (provider: string) => ({
  provider: provider,
  username: faker.internet.userName(),
  avatar: faker.helpers.maybe(getFakeImg) ?? null,
});
