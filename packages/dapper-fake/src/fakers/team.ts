import { faker } from "@faker-js/faker";

import { getFakeImg, getFakeLink, getIds, setSeed } from "./utils";

const getFakeTeamMember = () => ({
  user: faker.internet.userName(),
  role: faker.helpers.arrayElement(["Owner", "Member"]),
  imageSource: getFakeImg(),
});

export const getFakeTeam = async (teamId: string) => {
  setSeed(teamId);

  return {
    name: faker.word.words(3),
    imageSource: getFakeImg(),
    description: faker.lorem.paragraphs(12),
    about: faker.lorem.words(16),
    members: getIds(10).map(getFakeTeamMember),
    dynamicLinks: [getFakeLink(), getFakeLink(), getFakeLink()],
    donationLink: faker.internet.url(),
  };
};

export const getFakeTeamDetails = async (teamName: string) => {
  setSeed(teamName);

  return {
    identifier: faker.number.int(),
    name: faker.word.words(3),
    donation_link: faker.helpers.maybe(faker.internet.url) ?? null,
  };
};

const getFakeTempTeamMember = () => ({
  identifier: faker.number.int(),
  username: faker.internet.userName(),
  avatar: faker.helpers.maybe(getFakeImg) ?? null,
  role: faker.helpers.arrayElement<"owner" | "member">(["owner", "member"]),
});

export const getFakeTeamMembers = async (teamName: string) => {
  setSeed(teamName);
  return getIds(10).map(getFakeTempTeamMember);
};
