import { faker } from "@faker-js/faker";
import {
  Category,
  Community,
  CommunityPreview,
  Package,
  PackageDependency,
  PackagePreview,
  PackageVersion,
  Receipt,
  Server,
  ServerPreview,
  ServiceAccount,
  Team,
  TeamMember,
  TeamPreview,
  TeamSettings,
  User,
  UserSettings,
  UserSubscription,
} from "../schema";
import { strToHashInt } from "../utils/utils";

export function getRandomCategories(returnAmount?: number): Category[] {
  const categories = [
    { name: "Mods", slug: "mods" },
    { name: "Tools", slug: "tools" },
    { name: "Libraries", slug: "libraries" },
    { name: "Modpacks", slug: "modpacks" },
    { name: "Skins", slug: "skins" },
    { name: "Maps", slug: "maps" },
    { name: "Tweaks", slug: "tweaks" },
    { name: "Items", slug: "items" },
    { name: "Language", slug: "language" },
    { name: "Audio", slug: "audio" },
    { name: "Enemies", slug: "enemies" },
  ];
  return categories
    .sort(function () {
      return 0.5 - Math.random();
    })
    .slice(0, returnAmount ? returnAmount : 3);
}

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
    discordLink: faker.internet.url(),
  };
}

export function getPackageDependencyDummyData(
  seed?: string,
  community?: string,
  namespace?: string
): PackageDependency {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return {
    name: faker.random.words(3),
    namespace: namespace ? namespace : faker.random.word(),
    community: community ? community : faker.random.word(),
    shortDescription: faker.company.bs(),
    imageSource: faker.image.abstract(525, 525, true),
    version: `${faker.datatype.number({
      min: 0,
      max: 10,
    })}.${faker.datatype.number({ min: 0, max: 10 })}.${faker.datatype.number({
      min: 0,
      max: 10,
    })}`,
  };
}

export function getPackagePreviewDummyData(
  seed?: string,
  community?: string,
  author?: string,
  namespace?: string
): PackagePreview {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return {
    name: faker.random.words(3),
    namespace: namespace ? namespace : faker.random.word(),
    community: community ? community : faker.random.word(),
    description: faker.company.bs(),
    imageSource: faker.image.abstract(525, 525, true),
    downloadCount: faker.datatype.number({ min: 1000000, max: 10000000 }),
    likes: faker.datatype.number({ min: 0, max: 100000 }),
    size: faker.datatype.number({ min: 20000, max: 10000000 }),
    author: author ? author : faker.name.fullName(),
    lastUpdated: faker.date.recent(700).toDateString(),
    isPinned: faker.datatype.boolean(),
    isNsfw: faker.datatype.boolean(),
    isDeprecated: faker.datatype.boolean(),
    categories: getRandomCategories(),
  };
}

export function getPackageVersionDummyData(seed?: string): PackageVersion {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return {
    version: `${faker.datatype.number({
      min: 0,
      max: 10,
    })}.${faker.datatype.number({ min: 0, max: 10 })}.${faker.datatype.number({
      min: 0,
      max: 10,
    })}`,
    changelog: faker.company.bs(),
    uploadDate: faker.date.recent(700).toDateString(),
    downloadCount: faker.datatype.number({ min: 1000000, max: 10000000 }),
  };
}

export function getPackageDummyData(
  seed?: string,
  commmunity?: string,
  namespace?: string,
  name?: string
): Package {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return {
    name: name ? name : faker.random.words(3),
    namespace: namespace ? namespace : faker.random.word(),
    community: commmunity ? commmunity : faker.random.words(3),
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
    firstUploaded: faker.date.past(2).toDateString(),
    dependencies: [
      getPackageDependencyDummyData(),
      getPackageDependencyDummyData(),
      getPackageDependencyDummyData(),
    ],
    dependencyString: faker.datatype.uuid(),
    dependantCount: faker.datatype.number({ min: 0, max: 2000 }),
    team: getTeamDummyData(seed),
    categories: getRandomCategories(),
    versions: getListOfIds(20).map((x) => {
      return getPackageVersionDummyData(x);
    }),
  };
}

export function getCategoryDummyData(seed?: string): string {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return faker.word.noun();
}

export function getTeamMemberDummyData(seed?: string): TeamMember {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return {
    user: faker.internet.userName(),
    imageSource: faker.image.abstract(525, 525, true),
    role: faker.name.jobTitle(),
  };
}

export function getTeamDummyData(seed?: string): Team {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return {
    name: faker.random.words(3),
    imageSource: faker.image.abstract(525, 525, true),
    description: faker.lorem.paragraphs(12),
    about: faker.lorem.words(16),
    members: getListOfIds(5).map((x) => {
      return getTeamMemberDummyData(x);
    }),
    dynamicLinks: [
      { title: faker.random.word(), url: faker.internet.url() },
      { title: faker.random.word(), url: faker.internet.url() },
      { title: faker.random.word(), url: faker.internet.url() },
    ],
    donationLink: faker.internet.url(),
  };
}

export function getTeamSettingsDummyData(seed?: string): TeamSettings {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return {
    name: faker.random.words(3),
    imageSource: faker.image.abstract(525, 525, true),
    description: faker.lorem.paragraphs(12),
    about: faker.lorem.words(16),
    members: getListOfIds(5).map((x) => {
      return getTeamMemberDummyData(x);
    }),
    serviceAccounts: [
      faker.datatype.uuid(),
      faker.datatype.uuid(),
      faker.datatype.uuid(),
    ],
    dynamicLinks: [
      { title: faker.random.word(), url: faker.internet.url() },
      { title: faker.random.word(), url: faker.internet.url() },
      { title: faker.random.word(), url: faker.internet.url() },
    ],
    donationLink: faker.internet.url(),
  };
}

export function getTeamPreviewDummyData(seed?: string): TeamPreview {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return {
    name: faker.random.words(3),
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
    imageSource: faker.image.abstract(525, 525, true),
    description: faker.lorem.paragraphs(12),
    about: faker.lorem.words(16),
    accountCreated: faker.date.recent(700).toDateString(),
    lastActive: faker.date.recent(700).toDateString(),
    dynamicLinks: [
      { title: faker.random.word(), url: faker.internet.url() },
      { title: faker.random.word(), url: faker.internet.url() },
      { title: faker.random.word(), url: faker.internet.url() },
    ],
    // TODO: We are missing generated badges and achievements
    showBadgesOnProfile: true,
    showAchievementsOnProfile: true,
  };
}

export function getUserSettingsDummyData(seed?: string): UserSettings {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return {
    name: faker.internet.userName(),
    imageSource: faker.image.abstract(525, 525, true),
    description: faker.lorem.paragraphs(12),
    about: faker.lorem.words(16),
    accountCreated: faker.date.recent(700).toDateString(),
    lastActive: faker.date.recent(700).toDateString(),
    dynamicLinks: [
      { title: faker.random.word(), url: faker.internet.url() },
      { title: faker.random.word(), url: faker.internet.url() },
      { title: faker.random.word(), url: faker.internet.url() },
    ],
    // TODO: We are missing generated badges and achievements
    showBadgesOnProfile: true,
    showAchievementsOnProfile: true,
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

export function getServerDummyData(seed?: string): Server {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return {
    name: faker.random.words(3),
    namespace: faker.random.word(),
    community: faker.random.words(3),
    description: faker.company.bs(),
    shortDescription: faker.company.bs(),
    imageSource: faker.image.abstract(525, 525, true),
    likes: faker.datatype.number({ min: 0, max: 100000 }),
    isPvp: faker.datatype.boolean(),
    hasPassword: faker.datatype.boolean(),
    address: faker.internet.ipv4(),
    author: faker.name.fullName(),
    packageCount: faker.datatype.number({ min: 0, max: 100000 }),
    dynamicLinks: [
      { title: faker.random.word(), url: faker.internet.url() },
      { title: faker.random.word(), url: faker.internet.url() },
      { title: faker.random.word(), url: faker.internet.url() },
    ],
  };
}

export function getServerPreviewDummyData(seed?: string): ServerPreview {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return {
    name: faker.random.words(3),
    imageSource: faker.image.abstract(525, 525, true),
    isPvp: faker.datatype.boolean(),
    hasPassword: faker.datatype.boolean(),
    packageCount: faker.datatype.number({ min: 0, max: 100000 }),
  };
}

export function getReceiptDummyData(seed?: string): Receipt {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return {
    datetime: faker.date.recent(700).toDateString(),
    paymentId: `${faker.datatype.number({ min: 0, max: 100000 })}`,
    cost: "5.26 USD",
    company: faker.random.words(1),
    subscriptionName: faker.random.words(3),
    paymentMethod: "PAYPAL",
  };
}

export function getSubscriptionDummyData(seed?: string): UserSubscription {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return {
    name: faker.random.words(3),
    cost: "5.26 USD",
    subscriptionId: `${faker.datatype.number({ min: 0, max: 100000 })}`,
    isActive: faker.datatype.boolean(),
    renewDate: faker.date.recent(700).toDateString(),
    imageSource: faker.image.abstract(525, 525, true),
  };
}
