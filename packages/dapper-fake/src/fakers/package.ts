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
  type: PackageListingType,
  ordering = "last-updated",
  page = 1,
  q = "",
  includedCategories: string[] = [],
  excludedCategories: string[] = [],
  section = "",
  nsfw = false,
  deprecated = false
) => {
  const pageSize = 20;
  const count = 200;
  const normalizedPage = Number.isFinite(page)
    ? Math.max(1, Math.trunc(page))
    : 1;
  const currentPage = normalizedPage;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, count);
  const pageLength = Math.max(endIndex - startIndex, 0);

  const collectionPath = (() => {
    switch (type.kind) {
      case "community":
        return `api/cyberstorm/listing/${type.communityId.toLowerCase()}/`;
      case "namespace":
        return `api/cyberstorm/listing/${type.communityId.toLowerCase()}/${type.namespaceId.toLowerCase()}/`;
      case "package-dependants":
        return `api/cyberstorm/listing/${type.communityId.toLowerCase()}/${type.namespaceId.toLowerCase()}/${type.packageName.toLowerCase()}/dependants/`;
      default:
        return "api/cyberstorm/listing/";
    }
  })();

  const buildQueryString = (targetPage: number) => {
    const params = new URLSearchParams();
    params.set("page", String(targetPage));
    if (ordering) {
      params.set("ordering", ordering);
    }
    if (q) {
      params.set("q", q);
    }
    includedCategories?.forEach((value) => {
      params.append("included_categories", value);
    });
    excludedCategories?.forEach((value) => {
      params.append("excluded_categories", value);
    });
    if (section) {
      params.set("section", section);
    }
    if (nsfw) {
      params.set("nsfw", "true");
    }
    if (deprecated) {
      params.set("deprecated", "true");
    }
    return params.toString();
  };

  const buildPageUrl = (targetPage: number) =>
    `https://thunderstore.io/${collectionPath}?${buildQueryString(targetPage)}`;

  const hasNext = endIndex < count;
  const next = hasNext ? buildPageUrl(currentPage + 1) : null;
  const previous = currentPage > 1 ? buildPageUrl(currentPage - 1) : null;

  const results = range(pageLength).map((index) => {
    const namespaceId =
      type.kind === "namespace" || type.kind === "package-dependants"
        ? type.namespaceId
        : `${type.communityId}-namespace-${currentPage}-${index}`;
    const packageName =
      type.kind === "package-dependants"
        ? `${type.packageName.toLowerCase()}-dependant-${currentPage}-${index}`
        : `${namespaceId}-package-${currentPage}-${index}`;

    return getFakePackageListing(type.communityId, namespaceId, packageName);
  });

  return {
    count,
    next,
    previous,
    results,
  };
};

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

export const getFakePackagePermissions = async (
  community: string,
  namespace: string,
  name: string
) => {
  const seed = `${community}-${namespace}-${name}`;
  setSeed(seed);

  // Return shape mirrors API: { package, permissions }
  const canManage = faker.datatype.boolean(0.6);
  const canModerate = faker.datatype.boolean(0.2);

  return {
    package: {
      community_id: community,
      namespace_id: namespace,
      package_name: name,
    },
    permissions: {
      can_manage: canManage,
      can_manage_deprecation: faker.datatype.boolean(0.5),
      can_manage_categories: faker.datatype.boolean(0.5),
      can_deprecate: faker.datatype.boolean(0.5),
      can_undeprecate: faker.datatype.boolean(0.5),
      can_unlist: faker.datatype.boolean(0.5),
      can_moderate: canModerate,
      // Viewing pages is typically allowed if you can manage or moderate
      can_view_package_admin_page:
        canManage || canModerate || faker.datatype.boolean(0.3),
      can_view_listing_admin_page:
        canManage || canModerate || faker.datatype.boolean(0.3),
    },
  };
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

// Content used to render Package's detail view.
export const getFakePackageVersionDetails = async (
  namespace: string,
  name: string,
  version: string
) => {
  const seed = `${namespace}-${name}-${version}`;
  setSeed(seed);

  // Generate a base icon (nullable 10% of time)
  const iconUrl =
    faker.helpers.maybe(() => getFakeImg(), {
      probability: 0.9,
    }) ?? null;

  // Fake dependencies (reuse logic but need extra flags)
  const dependencyCount = faker.number.int({ min: 0, max: 6 });
  const dependencies = await Promise.all(
    range(dependencyCount).map(async () => {
      const depSeed = `${seed}-dep-${faker.string.alpha(8)}`;
      setSeed(depSeed);
      const isActive = faker.datatype.boolean(0.8);
      const removed = faker.datatype.boolean(0.1);
      const unavailable = !removed && faker.datatype.boolean(0.05);
      return {
        description: isActive
          ? faker.company.buzzPhrase()
          : "This package has been removed.",
        icon_url: isActive
          ? faker.helpers.maybe(() => getFakeImg(256, 256), {
              probability: 0.85,
            }) ?? null
          : null,
        is_active: isActive,
        name: faker.word.words(3).split(" ").join("_"),
        namespace: faker.word.sample(),
        version_number: getVersionNumber(),
        is_removed: removed,
        is_unavailable: unavailable,
      };
    })
  );

  return {
    description: faker.company.buzzPhrase(),
    download_count: faker.number.int({ min: 0, max: 5_000_000 }),
    icon_url: iconUrl,
    name,
    namespace,
    size: faker.number.int({ min: 20_000, max: 4_000_000_000 }),
    datetime_created: faker.date.past({ years: 2 }).toISOString(),
    dependencies,
    dependency_count: dependencies.length,
    download_url: `https://thunderstore.io/package/download/${namespace}/${name}/${version}/`,
    full_version_name: `${namespace}-${name}-${version}`,
    team: {
      name: faker.word.words(3),
      members: await getFakeTeamMembers(seed),
    },
    website_url:
      faker.helpers.maybe(() => faker.internet.url(), {
        probability: 0.9,
      }) ?? null,
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

const fakePackageVersionDependencies = range(25).map(() => ({
  description: faker.company.buzzPhrase(),
  icon_url: getFakeImg(256, 256),
  is_active: faker.datatype.boolean(0.5),
  name: faker.word.words(3).split(" ").join("_"),
  namespace: faker.word.sample(),
  version_number: getVersionNumber(),
  is_removed: faker.datatype.boolean(0.5),
}));

export const getFakePackageVersionDependencies = async (
  namespace: string,
  name: string,
  version: string,
  page?: number
) => {
  setSeed(`${namespace}-${name}-${version}`);
  const normalizedPage =
    typeof page === "number" && Number.isFinite(page)
      ? Math.max(1, Math.trunc(page))
      : 1;

  // Split the fake data into pages of 10 items each.

  const start = (normalizedPage - 1) * 10;
  const end = start + 10;
  const items = fakePackageVersionDependencies.slice(start, end);

  return {
    count: fakePackageVersionDependencies.length,
    next:
      end < fakePackageVersionDependencies.length
        ? `https://thunderstore.io/api/cyberstorm/package/${namespace}/${name}/v/${version}/dependencies/?page=${
            normalizedPage + 1
          }`
        : null,
    previous:
      normalizedPage > 1
        ? `https://thunderstore.io/api/cyberstorm/package/${namespace}/${name}/v/${version}/dependencies/?page=${
            normalizedPage - 1
          }`
        : null,
    results: items,
  };
};

const getVersionNumber = (min = 0, max = 10) => {
  const major = faker.number.int({ min, max });
  const minor = faker.number.int({ min, max });
  const fix = faker.number.int({ min, max });
  return `${major}.${minor}.${fix}`;
};

// Shown on a tab on Package's detail view.
export const getFakePackageSource = async (namespace: string, name: string) => {
  return {
    is_visible: true,
    namespace,
    package_name: name,
    version_number: getVersionNumber(),
    last_decompilation_date: faker.date.recent({ days: 700 }).toISOString(),
    decompilations: getFakeDecompilations(),
  };
};

const getFakeDecompilations = () => {
  return range(50).map(() => {
    return {
      source_file_name: faker.system.fileName(),
      url: faker.internet.url(),
      result_size: faker.number.int({ min: 0, max: 1000000 }).toString(),
      result: faker.lorem.paragraph(),
      is_truncated: faker.datatype.boolean(0.5),
    };
  });
};
