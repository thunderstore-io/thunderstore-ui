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
