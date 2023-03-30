import { faker } from "@faker-js/faker";
import {
  CommunityPreview,
  Package,
  PackagePreview,
  ServiceAccount,
  Team,
  TeamMember,
  User,
} from "../schema";

export function getListOfIds(length: number, seed?: number) {
  faker.seed(seed ? seed : 1337);
  return faker.datatype.array(length).map((element) => {
    return element.toString();
  });
}

export function getCommunityPreviewDummyData(seed?: number): CommunityPreview {
  faker.seed(seed ? seed : 1337);
  return {
    name: faker.random.words(3),
    namespace: "namespace",
    downloadCount: faker.datatype.number({ min: 1000000, max: 10000000 }),
    packageCount: faker.datatype.number({ min: 0, max: 100000 }),
    serverCount: faker.datatype.number({ min: 0, max: 1000 }),
    imageSource: faker.image.abstract(300, 450, true),
  };
}

export function getPackagePreviewDummyData(seed?: number): PackagePreview {
  faker.seed(seed ? seed : 1337);
  return {
    name: faker.random.words(3),
    namespace: "namespace",
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

export function getPackageDummyData(seed?: number): Package {
  faker.seed(seed ? seed : 1337);
  return {
    name: faker.random.words(3),
    namespace: "namespace",
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
    dependencyString: faker.datatype.uuid(),
    team: faker.datatype.uuid(),
    categories: [faker.word.noun(), faker.word.noun(), faker.word.noun()],
  };
}

export function getTeamDummyData(seed?: number): Team {
  faker.seed(seed ? seed : 1337);
  return {
    name: faker.random.words(3),
    namespace: "namespace",
    imageSource: faker.image.abstract(525, 525, true),
    description: faker.lorem.paragraphs(12),
    about: faker.lorem.words(16),
    members: [
      faker.datatype.uuid(),
      faker.datatype.uuid(),
      faker.datatype.uuid(),
    ],
    serviceAccounts: [
      faker.datatype.uuid(),
      faker.datatype.uuid(),
      faker.datatype.uuid(),
    ],
  };
}

export function getUserDummyData(seed?: number): User {
  faker.seed(seed ? seed : 1337);
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

export function getTeamMemberDummyData(seed?: number): TeamMember {
  faker.seed(seed ? seed : 1337);
  return {
    user: faker.datatype.uuid(),
    role: faker.name.jobTitle(),
  };
}

export function getServiceAccountDummyData(seed?: number): ServiceAccount {
  faker.seed(seed ? seed : 1337);
  return {
    name: faker.internet.userName(),
    lastUsed: faker.date.recent(700).toDateString(),
  };
}
