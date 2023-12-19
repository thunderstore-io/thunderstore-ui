import { faker } from "@faker-js/faker";
import { PackageListingType } from "@thunderstore/dapper/types";

import { getFakeImg, getFakePackageCategories, range, setSeed } from "./utils";
import { getFakeTeamMembers } from "./team";

// Content used to render one PackageCard in a list view.
const getFakePackageListing = (
  community?: string,
  namespace?: string,
  name?: string
) => {
  const seed = `${community}-${namespace}-${name}`;
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
    last_updated: faker.date.recent({ days: 700 }).toISOString(),
    name: name ?? faker.word.words(3).split(" ").join("_"),
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
    getFakePackageListing(
      type.communityId,
      type.kind === "namespace" ? type.namespaceId : faker.word.sample()
    )
  ),
});

export const getFakeDependencies = async (
  community: string,
  namespace: string,
  name?: string,
  count = 5
) => {
  setSeed(`${community}-${namespace}-${name ?? "package"}`);

  return range(count).map(() => ({
    community_identifier: community,
    description: faker.company.buzzPhrase(),
    icon_url: faker.helpers.maybe(getFakeImg, { probability: 0.9 }) ?? null,
    name: (name ?? faker.word.words(3)).split(" ").join("_"),
    namespace,
    version_number: getVersionNumber(),
  }));
};

// Content used to render Package's detail view.
export const getFakePackageListingDetails = async (
  community: string,
  namespace: string,
  name: string
) => {
  const seed = `${community}-${namespace}-${name}`;
  setSeed(seed);

  return {
    ...getFakePackageListing(community, namespace, name),

    community_name: faker.word.sample(),
    datetime_created: faker.date.past({ years: 2 }).toISOString(),
    dependant_count: faker.number.int({ min: 0, max: 2000 }),
    dependencies: await getFakeDependencies(community, namespace, name),
    full_version_name: `${namespace}-${name}-${getVersionNumber()}`,
    has_changelog: true,
    latest_version_number: getVersionNumber(),
    team: {
      name: faker.word.words(3),
      members: await getFakeTeamMembers(seed),
    },
    website_url:
      faker.helpers.maybe(faker.internet.url, { probability: 0.9 }) ?? null,
  };
};

// const getPackageVersion = () => ({
//   version_number: getVersionNumber(),
//   changelog: faker.company.buzzPhrase(),
//   datetime_created: faker.date.recent({ days: 700 }).toISOString(),
//   download_count: faker.number.int({ min: 1000000, max: 10000000 }),
// });

const getVersionNumber = (min = 0, max = 10) => {
  const major = faker.number.int({ min, max });
  const minor = faker.number.int({ min, max });
  const fix = faker.number.int({ min, max });
  return `${major}.${minor}.${fix}`;
};
