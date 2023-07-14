import { faker } from "@faker-js/faker";
import {
  Category,
  CommunityPreview,
  Connection,
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
} from "../../schema";
import { Community } from "../../cyberstormSchemas/community";

export const strToHashInt = function (inputString: string) {
  return inputString
    ? inputString.split("").reduce(function (a, b) {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
      }, 0)
    : 0;
};

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
  return Array(length)
    .fill(0)
    .map(() => faker.string.uuid());
}

export function getCommunityPreviewDummyData(seed?: string): CommunityPreview {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return {
    name: faker.word.words(3),
    namespace: "namespace",
    downloadCount: faker.number.int({ min: 1000000, max: 10000000 }),
    packageCount: faker.number.int({ min: 0, max: 100000 }),
    serverCount: faker.number.int({ min: 0, max: 1000 }),
    imageSource: faker.image.urlLoremFlickr({
      width: 300,
      height: 450,
      category: "abstract",
    }),
  };
}

export function getCommunityDummyData(seed?: string): Community {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return {
    name: faker.word.words(3),
    identifier: faker.word.sample(),
    total_download_count: faker.number.int({ min: 1000000, max: 10000000 }),
    total_package_count: faker.number.int({ min: 0, max: 100000 }),
    total_server_count: faker.number.int({ min: 0, max: 100000 }),
    background_image_url: faker.image.urlLoremFlickr({
      width: 1920,
      height: 1080,
      category: "abstract",
    }),
    portrait_image_url: faker.image.urlLoremFlickr({
      width: 142,
      height: 188,
      category: "abstract",
    }),
    description: faker.lorem.paragraphs(3),
    discord_url: faker.internet.url(),
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
    name: faker.word.words(3).split(" ").join("_"),
    namespace: namespace ? namespace : faker.word.sample(),
    community: community ? community : faker.word.sample(),
    shortDescription: faker.company.buzzPhrase(),
    imageSource: faker.image.urlLoremFlickr({
      width: 525,
      height: 525,
      category: "abstract",
    }),
    version: `${faker.number.int({
      min: 0,
      max: 10,
    })}.${faker.number.int({ min: 0, max: 10 })}.${faker.number.int({
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
    name: faker.word.words(3),
    namespace: namespace ? namespace : faker.word.sample(),
    community: community ? community : faker.word.sample(),
    description: faker.company.buzzPhrase(),
    imageSource: faker.image.urlLoremFlickr({
      width: 525,
      height: 525,
      category: "abstract",
    }),
    downloadCount: faker.number.int({ min: 1000000, max: 10000000 }),
    likes: faker.number.int({ min: 0, max: 100000 }),
    size: faker.number.int({ min: 20000, max: 10000000 }),
    author: author ? author : faker.person.fullName(),
    lastUpdated: faker.date.recent({ days: 700 }).toDateString(),
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
    version: `${faker.number.int({
      min: 0,
      max: 10,
    })}.${faker.number.int({ min: 0, max: 10 })}.${faker.number.int({
      min: 0,
      max: 10,
    })}`,
    changelog: faker.company.buzzPhrase(),
    uploadDate: faker.date.recent({ days: 700 }).toDateString(),
    downloadCount: faker.number.int({ min: 1000000, max: 10000000 }),
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
    name: name ? name : faker.word.words(3),
    namespace: namespace ? namespace : faker.word.sample(),
    community: commmunity ? commmunity : faker.word.words(3),
    shortDescription: faker.company.buzzPhrase(),
    description: faker.lorem.paragraphs(12),
    imageSource: faker.image.urlLoremFlickr({
      width: 525,
      height: 525,
      category: "abstract",
    }),
    downloadCount: faker.number.int({ min: 1000000, max: 10000000 }),
    likes: faker.number.int({ min: 0, max: 100000 }),
    size: faker.number.int({ min: 20000, max: 10000000 }),
    author: faker.person.fullName(),
    lastUpdated: faker.date.recent({ days: 700 }).toDateString(),
    isPinned: faker.datatype.boolean(),
    isNsfw: faker.datatype.boolean(),
    isDeprecated: faker.datatype.boolean(),
    firstUploaded: faker.date.past({ years: 2 }).toDateString(),
    dependencies: [
      getPackageDependencyDummyData("1"),
      getPackageDependencyDummyData("2"),
      getPackageDependencyDummyData("3"),
      getPackageDependencyDummyData("4"),
      getPackageDependencyDummyData("5"),
    ],
    dependencyString: faker.string.uuid(),
    dependantCount: faker.number.int({ min: 0, max: 2000 }),
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
    imageSource: faker.image.urlLoremFlickr({
      width: 525,
      height: 525,
      category: "abstract",
    }),
    role: faker.helpers.arrayElement(["Owner", "Member"]),
  };
}

export function getTeamDummyData(seed?: string): Team {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return {
    name: faker.word.words(3),
    imageSource: faker.image.urlLoremFlickr({
      width: 525,
      height: 525,
      category: "abstract",
    }),
    description: faker.lorem.paragraphs(12),
    about: faker.lorem.words(16),
    members: getListOfIds(10).map((x) => {
      return getTeamMemberDummyData(x);
    }),
    dynamicLinks: [
      { title: faker.word.sample(), url: faker.internet.url() },
      { title: faker.word.sample(), url: faker.internet.url() },
      { title: faker.word.sample(), url: faker.internet.url() },
    ],
    donationLink: faker.internet.url(),
  };
}

export function getTeamSettingsDummyData(seed?: string): TeamSettings {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return {
    name: faker.word.words(3),
    imageSource: faker.image.urlLoremFlickr({
      width: 525,
      height: 525,
      category: "abstract",
    }),
    description: faker.lorem.paragraphs(12),
    about: faker.lorem.words(16),
    members: getListOfIds(5).map((x) => {
      return getTeamMemberDummyData(x);
    }),
    serviceAccounts: [
      faker.string.uuid(),
      faker.string.uuid(),
      faker.string.uuid(),
    ],
    dynamicLinks: [
      { title: faker.word.sample(), url: faker.internet.url() },
      { title: faker.word.sample(), url: faker.internet.url() },
      { title: faker.word.sample(), url: faker.internet.url() },
    ],
    donationLink: faker.internet.url(),
  };
}

export function getTeamPreviewDummyData(seed?: string): TeamPreview {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return {
    name: faker.word.words(3),
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
    imageSource: faker.image.urlLoremFlickr({
      width: 525,
      height: 525,
      category: "abstract",
    }),
    description: faker.lorem.paragraphs(12),
    about: faker.lorem.words(16),
    accountCreated: faker.date.recent({ days: 700 }).toDateString(),
    lastActive: faker.date.recent({ days: 700 }).toDateString(),
    dynamicLinks: [
      { title: faker.word.sample(), url: faker.internet.url() },
      { title: faker.word.sample(), url: faker.internet.url() },
      { title: faker.word.sample(), url: faker.internet.url() },
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
    imageSource: faker.image.urlLoremFlickr({
      width: 525,
      height: 525,
      category: "abstract",
    }),
    description: faker.lorem.paragraphs(12),
    about: faker.lorem.words(16),
    accountCreated: faker.date.recent({ days: 700 }).toDateString(),
    lastActive: faker.date.recent({ days: 700 }).toDateString(),
    dynamicLinks: [
      { title: faker.word.sample(), url: faker.internet.url() },
      { title: faker.word.sample(), url: faker.internet.url() },
      { title: faker.word.sample(), url: faker.internet.url() },
    ],
    // TODO: We are missing generated badges and achievements
    showBadgesOnProfile: true,
    showAchievementsOnProfile: true,
    connections: [getConnectionDummyData("1"), getConnectionDummyData("a")],
  };
}

export function getConnectionDummyData(seed?: string): Connection {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return {
    name: faker.helpers.arrayElement(["Github", "Discord"]),
    connectedUsername: faker.internet.userName(),
    enabled: faker.datatype.boolean(),
    imageSource: "",
  };
}

export function getServiceAccountDummyData(seed?: string): ServiceAccount {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return {
    name: faker.internet.userName(),
    lastUsed: faker.date.recent({ days: 700 }).toDateString(),
  };
}

export function getServerDummyData(seed?: string): Server {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return {
    name: faker.word.words(3),
    namespace: faker.word.sample(),
    community: faker.word.words(3),
    description: faker.company.buzzPhrase(),
    shortDescription: faker.company.buzzPhrase(),
    imageSource: faker.image.urlLoremFlickr({
      width: 525,
      height: 525,
      category: "abstract",
    }),
    likes: faker.number.int({ min: 0, max: 100000 }),
    isPvp: faker.datatype.boolean(),
    hasPassword: faker.datatype.boolean(),
    address: faker.internet.ipv4(),
    author: faker.person.fullName(),
    packageCount: faker.number.int({ min: 0, max: 100000 }),
    dynamicLinks: [
      { title: faker.word.sample(), url: faker.internet.url() },
      { title: faker.word.sample(), url: faker.internet.url() },
      { title: faker.word.sample(), url: faker.internet.url() },
    ],
  };
}

export function getServerPreviewDummyData(seed?: string): ServerPreview {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return {
    name: faker.word.words(3),
    imageSource: faker.image.urlLoremFlickr({
      width: 525,
      height: 525,
      category: "abstract",
    }),
    isPvp: faker.datatype.boolean(),
    hasPassword: faker.datatype.boolean(),
    packageCount: faker.number.int({ min: 0, max: 100000 }),
  };
}

export function getReceiptDummyData(seed?: string): Receipt {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return {
    datetime: faker.date.recent({ days: 700 }).toDateString(),
    paymentId: `${faker.number.int({ min: 0, max: 100000 })}`,
    cost: "5.26 USD",
    company: faker.word.words(1),
    subscriptionName: faker.word.words(3),
    paymentMethod: "PAYPAL",
  };
}

export function getSubscriptionDummyData(seed?: string): UserSubscription {
  const parsedSeed = strToHashInt(seed ? seed : "1337");
  faker.seed(parsedSeed);
  return {
    name: faker.word.words(3),
    cost: "5.26 USD",
    subscriptionId: `${faker.number.int({ min: 0, max: 100000 })}`,
    isActive: faker.datatype.boolean(),
    renewDate: faker.date.recent({ days: 700 }).toDateString(),
    imageSource: faker.image.urlLoremFlickr({
      width: 525,
      height: 525,
      category: "abstract",
    }),
  };
}
