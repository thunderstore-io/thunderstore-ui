import { faker } from "@faker-js/faker";
import { PackageListingType } from "@thunderstore/dapper/types";

import { getFakeImg, getFakePackageCategories, range, setSeed } from "./utils";
import { getFakeTeamMembers } from "./team";

// Content used to render one PackageCard in a list view.
const getFakePackagePreview = (community?: string, namespace?: string) => {
  const seed = `${community}-${namespace}`;
  setSeed(seed);

  return {
    categories: getFakePackageCategories(),
    community_identifier: community ?? faker.word.sample(),
    description: faker.company.buzzPhrase(),
    download_count: faker.number.int({ min: 100, max: 10000000 }),
    icon_url: faker.helpers.maybe(getFakeImg, { probability: 0.9 }) ?? null,
    is_deprecated: faker.datatype.boolean(0.1),
    is_nsfw: faker.datatype.boolean(0.1),
    is_pinned: faker.datatype.boolean(0.1),
    last_updated: faker.date.recent({ days: 700 }).toDateString(),
    name: faker.word.words(3).split(" ").join("_"),
    namespace: namespace ?? faker.word.sample(),
    rating_count: faker.number.int({ min: 0, max: 100000 }),
    size: faker.number.int({ min: 20000, max: 4000000000 }),
  };
};

// TODO: this implementation will show the same results when user
// interacts with filters or pagination. Something similar could be done
// here that's done for community listing, but getting all the filters
// to work properly might not be worth the effort.
export const getFakePackageListings = async (
  type: PackageListingType
  // ordering = "last-updated",
  // page = 1,
  // q = "",
  // includedCategories = [],
  // excludedCategories = [],
  // section = "",
  // nsfw = false,
  // deprecated = false
) => ({
  count: 200,
  hasMore: true,
  results: range(20).map(() =>
    getFakePackagePreview(
      type.communityId,
      type.kind === "namespace" ? type.namespaceId : faker.word.sample()
    )
  ),
});

// TODO: the methods below this point don't yet match what the backend
// will be actually returning.

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
    ...getFakePackagePreview(community, namespace),

    community_identifier: community,
    community_name: faker.word.sample(),
    discordLink: faker.internet.url(),
    author: faker.person.fullName(),
    dependantCount: faker.number.int({ min: 0, max: 2000 }),
    dependencies: await getFakeDependencies(community, namespace, name),
    dependencyString: faker.string.uuid(),
    firstUploaded: faker.date.past({ years: 2 }).toDateString(),
    gitHubLink: faker.internet.url(),
    shortDescription: faker.company.buzzPhrase(),
    team: {
      name: faker.word.words(3),
      members: await getFakeTeamMembers(seed),
    },
    versions: range(20).map(getPackageVersion),
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
