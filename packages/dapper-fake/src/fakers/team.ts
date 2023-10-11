import { faker } from "@faker-js/faker";

import { getFakeImg, getIds, setSeed } from "./utils";

export const getFakeTeamDetails = async (teamName: string) => {
  setSeed(teamName);

  return {
    identifier: faker.number.int(),
    name: faker.word.words(3),
    donation_link: faker.helpers.maybe(faker.internet.url) ?? null,
  };
};

const getFakeTeamMember = () => ({
  identifier: faker.number.int(),
  username: faker.internet.userName(),
  avatar: faker.helpers.maybe(getFakeImg) ?? null,
  role: faker.helpers.arrayElement<"owner" | "member">(["owner", "member"]),
});

export const getFakeTeamMembers = async (teamName: string) => {
  setSeed(teamName);
  return getIds(10).map(getFakeTeamMember);
};
