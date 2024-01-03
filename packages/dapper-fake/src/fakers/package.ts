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
    icon_url: getFakeImg(),
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

const getFakeDependencies = async (
  community: string,
  namespace: string,
  name?: string,
  count = 5
) => {
  setSeed(`${community}-${namespace}-${name ?? "package"}`);

  return range(count).map(() => {
    // Deactivated packages show no description or icon.
    const deactivatableFields = faker.helpers.maybe(
      () => ({
        description: faker.company.buzzPhrase(),
        icon_url: getFakeImg(256, 256),
        is_active: true,
      }),
      { probability: 0.8 }
    ) ?? {
      description: "This package has been removed.",
      icon_url: null,
      is_active: false,
    };

    return {
      ...deactivatableFields,
      community_identifier: community,
      name: (name ?? faker.word.words(3)).split(" ").join("_"),
      namespace,
      version_number: getVersionNumber(),
    };
  });
};

// Content used to render Package's detail view.
export const getFakePackageListingDetails = async (
  community: string,
  namespace: string,
  name: string
) => {
  const seed = `${community}-${namespace}-${name}`;
  setSeed(seed);

  const version = getVersionNumber();
  const dependencies = await getFakeDependencies(community, namespace, name);

  return {
    ...getFakePackageListing(community, namespace, name),

    community_name: faker.word.sample(),
    datetime_created: faker.date.past({ years: 2 }).toISOString(),
    dependant_count: faker.number.int({ min: 0, max: 2000 }),
    dependencies,
    dependency_count: dependencies.length,
    download_url: `https://thunderstore.io/package/download/${namespace}/${name}/${version}/`,
    full_version_name: `${namespace}-${name}-${version}}`,
    has_changelog: true,
    install_url: `ror2mm://v1/install/thunderstore.io/${namespace}/${name}/${version}/`,
    latest_version_number: getVersionNumber(),
    team: {
      name: faker.word.words(3),
      members: await getFakeTeamMembers(seed),
    },
    website_url:
      faker.helpers.maybe(faker.internet.url, { probability: 0.9 }) ?? null,
  };
};

// Shown on a tab on Package's detail view.
export const getFakePackageVersions = async (
  namespace: string,
  name: string
) => {
  setSeed(`${namespace}-${name}`);
  const version = [0, 1, 0];

  return range(50).map(() => {
    const versionNumber = `${version[0]}.${version[1]}.${version[2]}`;
    const r = Math.random();

    if (r < 0.2) {
      version[0] += 1;
      version[1] = 0;
      version[2] = 0;
    } else if (r < 0.5) {
      version[1] += 1;
      version[2] = 0;
    } else {
      version[2] += 1;
    }

    return {
      version_number: versionNumber,
      datetime_created: faker.date.recent({ days: 700 }).toISOString(),
      download_count: faker.number.int({ min: 0, max: 200000 }),
      download_url: `https://thunderstore.io/package/download/${namespace}/${name}/${versionNumber}/`,
      install_url: `ror2mm://v1/install/thunderstore.io/${namespace}/${name}/${versionNumber}/`,
    };
  });
};

const getVersionNumber = (min = 0, max = 10) => {
  const major = faker.number.int({ min, max });
  const minor = faker.number.int({ min, max });
  const fix = faker.number.int({ min, max });
  return `${major}.${minor}.${fix}`;
};
