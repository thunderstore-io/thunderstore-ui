import { faker } from "@faker-js/faker";

import {
  getFakeImg,
  getFakeLink,
  getFakePackageCategories,
  range,
  setSeed,
} from "./utils";
import { getFakeTeamMembers } from "./team";

export const getFakeDependencies = async (
  community: string,
  namespace: string,
  name?: string,
  count = 5
) => {
  setSeed(`${community}-${namespace}-${name ?? "package"}`);

  return range(count).map(() => ({
    ...getPackageBase(community, namespace),
    version: getVersionNumber(),
  }));
};

export const getFakePackage = async (
  community: string,
  namespace: string,
  name: string
) => {
  const seed = `${community}-${namespace}-${name}`;
  setSeed(seed);

  return {
    ...getPackageBase(community, namespace, name),
    ...getPackageExtras(),

    author: faker.person.fullName(),
    dependantCount: faker.number.int({ min: 0, max: 2000 }),
    dependencies: await getFakeDependencies(community, namespace, name),
    dependencyString: faker.string.uuid(),
    description: faker.lorem.paragraphs(12),
    firstUploaded: faker.date.past({ years: 2 }).toDateString(),
    team: await getPackageTeam(seed),
    versions: range(20).map(getPackageVersion),
  };
};

// TODO: the DummyDapper implementation in the dapper package at the
// time of this writing has so many shortcomings and bugs that rather
// than try to duplicate that implementation, I'll save time and just
// return some packages. The whole Dapper method interface needs to be
// changed in order to be able to implement all the features we want, so
// this method can be updated once we get there.
export const getFakePackageListings = async (
  communityId?: string,
  namespaceId?: string,
  teamId?: string,
  userId?: string
) =>
  range(20).map(() =>
    getFakePackagePreview(
      communityId ?? faker.word.sample(),
      namespaceId ?? faker.word.sample(),
      teamId ?? faker.word.words(3),
      userId ?? faker.internet.userName()
    )
  );

const getFakePackagePreview = (
  community?: string,
  namespace?: string,
  team?: string,
  user?: string
) => {
  const seed = `${community}-${namespace}-${team}-${user}`;
  setSeed(seed);

  return {
    ...getPackageBase(community, namespace),
    ...getPackageExtras(),
    author: user ?? faker.person.fullName(),
    description: faker.company.buzzPhrase(),
  };
};

const getPackageBase = (
  community?: string,
  namespace?: string,
  name?: string
) => ({
  community: community ?? faker.word.sample(),
  namespace: namespace ?? faker.word.sample(),
  name: (name ?? faker.word.words(3)).split(" ").join("_"),
  shortDescription: faker.company.buzzPhrase(),
  imageSource: getFakeImg(),
});

const getPackageExtras = () => ({
  categories: getFakePackageCategories(),
  downloadCount: faker.number.int({ min: 1000000, max: 10000000 }),
  isDeprecated: faker.datatype.boolean(),
  isNsfw: faker.datatype.boolean(),
  isPinned: faker.datatype.boolean(),
  lastUpdated: faker.date.recent({ days: 700 }).toDateString(),
  likes: faker.number.int({ min: 0, max: 100000 }),
  size: faker.number.int({ min: 20000, max: 10000000 }),
});

const getPackageTeam = async (teamId: string) => {
  setSeed(teamId);

  return {
    name: faker.word.words(3),
    imageSource: getFakeImg(),
    description: faker.lorem.paragraphs(12),
    about: faker.lorem.words(16),
    members: await getFakeTeamMembers(teamId),
    dynamicLinks: [getFakeLink(), getFakeLink(), getFakeLink()],
    donationLink: faker.internet.url(),
  };
};

const getPackageVersion = () => ({
  version: getVersionNumber(),
  changelog: faker.company.buzzPhrase(),
  uploadDate: faker.date.recent({ days: 700 }).toDateString(),
  downloadCount: faker.number.int({ min: 1000000, max: 10000000 }),
});

const getVersionNumber = (min = 0, max = 10) => {
  const major = faker.number.int({ min, max });
  const minor = faker.number.int({ min, max });
  const fix = faker.number.int({ min, max });
  return `${major}.${minor}.${fix}`;
};
