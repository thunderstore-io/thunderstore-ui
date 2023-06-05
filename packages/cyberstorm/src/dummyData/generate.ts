import { faker } from "@faker-js/faker";
import {
  Community,
  CommunityPreview,
  Package,
  PackagePreview,
  ServiceAccount,
  Team,
  TeamMember,
  TeamPreview,
  User,
} from "../schema";
import { strToHashInt } from "../utils/utils";

export function getListOfIds(length: number, seed?: string) {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return faker.datatype.array(length).map((element) => {
    return element.toString();
  });
}

export function getCommunityPreviewDummyData(seed?: string): CommunityPreview {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return {
    name: faker.random.words(3),
    namespace: "namespace",
    downloadCount: faker.datatype.number({ min: 1000000, max: 10000000 }),
    packageCount: faker.datatype.number({ min: 0, max: 100000 }),
    serverCount: faker.datatype.number({ min: 0, max: 1000 }),
    imageSource: faker.image.abstract(300, 450, true),
  };
}
export function getCommunityDummyData(seed?: string): Community {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return {
    name: faker.random.words(3),
    namespace: "namespace",
    downloadCount: faker.datatype.number({ min: 1000000, max: 10000000 }),
    packageCount: faker.datatype.number({ min: 0, max: 100000 }),
    serverCount: faker.datatype.number({ min: 0, max: 1000 }),
    imageSource: faker.image.abstract(300, 450, true),
    description: faker.lorem.paragraphs(3),
    gitHubLink: faker.internet.url(),
  };
}

export function getPackagePreviewDummyData(seed?: string): PackagePreview {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return {
    name: faker.random.words(3),
    namespace: faker.random.word(),
    community: faker.random.words(3),
    description: faker.company.bs(),
    imageSource: faker.image.abstract(525, 525, true),
    downloadCount: faker.datatype.number({ min: 1000000, max: 10000000 }),
    likes: faker.datatype.number({ min: 0, max: 100000 }),
    size: faker.datatype.number({ min: 20000, max: 10000000 }),
    author: faker.name.fullName(),
    lastUpdated: faker.date.recent(700).toDateString(),
    isPinned: faker.datatype.boolean(),
    isNsfw: faker.datatype.boolean(),
    isDeprecated: faker.datatype.boolean(),
    categories: [faker.word.noun(), faker.word.noun(), faker.word.noun()],
  };
}

export function getPackageDummyData(seed?: string): Package {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return {
    name: faker.random.words(3),
    namespace: faker.random.word(),
    community: faker.random.words(3),
    shortDescription: faker.company.bs(),
    description: faker.lorem.paragraphs(12),
    imageSource: faker.image.abstract(525, 525, true),
    downloadCount: faker.datatype.number({ min: 1000000, max: 10000000 }),
    likes: faker.datatype.number({ min: 0, max: 100000 }),
    size: faker.datatype.number({ min: 20000, max: 10000000 }),
    author: faker.name.fullName(),
    lastUpdated: faker.date.recent(700).toDateString(),
    isPinned: faker.datatype.boolean(),
    isNsfw: faker.datatype.boolean(),
    isDeprecated: faker.datatype.boolean(),
    gitHubLink: faker.internet.url(),
    donationLink: faker.internet.url(),
    firstUploaded: faker.date.past(2).toDateString(),
    dependencies: [
      getPackagePreviewDummyData("1"),
      getPackagePreviewDummyData("2"),
      getPackagePreviewDummyData("3"),
    ],
    dependencyString: faker.datatype.uuid(),
    team: getTeamDummyData("1"),
    categories: [faker.word.noun(), faker.word.noun(), faker.word.noun()],
  };
}

export function getTeamDummyData(seed?: string): Team {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return {
    name: faker.random.words(3),
    namespace: "namespace",
    imageSource: faker.image.abstract(525, 525, true),
    description: faker.lorem.paragraphs(12),
    about: faker.lorem.words(16),
    members: [
      getTeamMemberDummyData("1"),
      getTeamMemberDummyData("2"),
      getTeamMemberDummyData("3"),
    ],
    serviceAccounts: [
      faker.datatype.uuid(),
      faker.datatype.uuid(),
      faker.datatype.uuid(),
    ],
  };
}

export function getTeamPreviewDummyData(seed?: string): TeamPreview {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return {
    name: faker.random.words(3),
    namespace: "namespace",
    members: [
      getTeamMemberDummyData("1"),
      getTeamMemberDummyData("2"),
      getTeamMemberDummyData("3"),
    ],
  };
}

export function getUserDummyData(seed?: string): User {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return {
    name: faker.internet.userName(),
    namespace: "namespace",
    imageSource: faker.image.abstract(525, 525, true),
    description: faker.lorem.paragraphs(12),
    about: faker.lorem.words(16),
    gitHubLink: faker.internet.url(),
    discordLink: faker.internet.url(),
    twitterLink: faker.internet.url(),
    accountCreated: faker.date.recent(700).toDateString(),
    lastActive: faker.date.recent(700).toDateString(),
    mods: [faker.datatype.uuid(), faker.datatype.uuid(), faker.datatype.uuid()],
  };
}

export function getTeamMemberDummyData(seed?: string): TeamMember {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return {
    user: getUserDummyData(seed),
    role: faker.name.jobTitle(),
  };
}

export function getServiceAccountDummyData(seed?: string): ServiceAccount {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return {
    name: faker.internet.userName(),
    lastUsed: faker.date.recent(700).toDateString(),
  };
}
