import { faker } from "@faker-js/faker";

import { getFakeImg, setSeed } from "./utils";

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
    rated_packages_cyberstorm: [],
    subscription: {
      expires:
        faker.helpers.maybe(() =>
          faker.date.soon({ days: 30 }).toDateString()
        ) ?? null,
    },
    teams: [
      {
        name: faker.word.words(1),
        role: "owner",
        member_count: faker.number.int({ min: 1, max: 100 }),
      },
      {
        name: faker.word.words(2),
        role: "member",
        member_count: faker.number.int({ min: 1, max: 100 }),
      },
    ],
  };
};

const getFakeOAuthConnection = (provider: string) => ({
  provider: provider,
  username: faker.internet.userName(),
  avatar: faker.helpers.maybe(getFakeImg) ?? null,
});
