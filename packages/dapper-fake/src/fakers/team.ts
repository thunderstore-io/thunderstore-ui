import { faker } from "@faker-js/faker";

import { teamCreate } from "@thunderstore/thunderstore-api";

import { getFakeImg, getIds, setSeed } from "./utils";

export const getFakeTeamDetails = async (teamName: string) => {
  setSeed(teamName);

  return {
    identifier: faker.number.int(),
    name: faker.word.words(3),
    donation_link: faker.helpers.maybe(faker.internet.url) ?? null,
  };
};

/**
 * Build a fake community entry for a team's community list
 *
 * @returns A fake team community
 */
const getFakeTeamCommunity = () => ({
  identifier: faker.word.sample(),
  name: faker.word.words(2),
  community_icon_url: faker.helpers.maybe(getFakeImg) ?? null,
  package_count: faker.number.int({ min: 1, max: 50 }),
  download_count: faker.number.int({ min: 0, max: 5000000 }),
  rating_count: faker.number.int({ min: 0, max: 20000 }),
});

/**
 * Get a seeded list of fake communities for a team
 *
 * @param teamName The name of the team, used as the seed
 * @returns Fake team communities
 */
export const getFakeTeamCommunities = async (teamName: string) => {
  setSeed(teamName);
  return getIds(3).map(getFakeTeamCommunity);
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

export async function postFakeTeamCreate(
  name: string
): ReturnType<typeof teamCreate> {
  return { identifier: 123, name: name, donation_link: null };
}
