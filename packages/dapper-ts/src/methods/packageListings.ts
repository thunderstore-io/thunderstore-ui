import { PackageListingType } from "@thunderstore/dapper/types";
import {
  fetchCommunityPackageListings,
  fetchNamespacePackageListings,
  fetchPackageDependantsListings,
  fetchPackageListingDetails,
  fetchPackageListingStatus,
  PackageListingsOrderingEnum,
  PackageListingsRequestQueryParams,
} from "@thunderstore/thunderstore-api";

import { DapperTsInterface } from "../index";

export async function getPackageListings(
  this: DapperTsInterface,
  type: PackageListingType,
  ordering?: string,
  page?: number,
  q?: string,
  includedCategories?: string[],
  excludedCategories?: string[],
  section?: string,
  nsfw?: boolean,
  deprecated?: boolean
) {
  let supportedOrdering = undefined;
  // As dapper accepts more options, than the TS api at this time, we'll need to check if the given ordering is supported.
  if (
    ordering &&
    Object.values(PackageListingsOrderingEnum).includes(
      ordering as PackageListingsOrderingEnum
    )
  ) {
    supportedOrdering = ordering as PackageListingsOrderingEnum;
  }

  const options: PackageListingsRequestQueryParams = [
    {
      key: "ordering",
      value: supportedOrdering,
      impotent: PackageListingsOrderingEnum.Updated,
    },
    {
      key: "page",
      value: page,
      impotent: 1,
    },
    {
      key: "q",
      value: q,
    },
    {
      key: "included_categories",
      value: includedCategories,
    },
    {
      key: "excluded_categories",
      value: excludedCategories,
    },
    {
      key: "section",
      value: section,
    },
    {
      key: "nsfw",
      value: nsfw,
      impotent: false,
    },
    {
      key: "deprecated",
      value: deprecated,
      impotent: false,
    },
  ];

  let data;

  if (type.kind === "community") {
    data = await fetchCommunityPackageListings({
      config: this.config,
      params: {
        community_id: type.communityId,
      },
      data: {},
      queryParams: options,
    });
  } else if (type.kind === "namespace") {
    data = await fetchNamespacePackageListings({
      config: this.config,
      params: {
        community_id: type.communityId,
        namespace_id: type.namespaceId,
      },
      data: {},
      queryParams: options,
    });
  } else if (type.kind === "package-dependants") {
    data = await fetchPackageDependantsListings({
      config: this.config,
      params: {
        community_id: type.communityId,
        namespace_id: type.namespaceId,
        package_name: type.packageName,
      },
      data: {},
      queryParams: options,
    });
  } else {
    throw new Error(
      "getPackageListing called with unimplement PackageListingType"
    );
  }

  return {
    count: data.count,
    hasMore: Boolean(data.next),
    results: data.results,
  };
}

export async function getPackageListingDetails(
  this: DapperTsInterface,
  communityId: string,
  namespaceId: string,
  packageName: string,
  version: string | undefined = undefined,
  useSession = false
) {
  const data = await fetchPackageListingDetails({
    config: this.config,
    params: {
      community_id: communityId,
      namespace_id: namespaceId,
      package_name: packageName,
      version_number: version,
    },
    data: {},
    queryParams: {},
    useSession: useSession,
  });

  return data;
}

export async function getPackageListingStatus(
  this: DapperTsInterface,
  communityId: string,
  namespaceId: string,
  packageName: string
) {
  const data = await fetchPackageListingStatus({
    config: this.config,
    params: {
      community_id: communityId,
      namespace_id: namespaceId,
      package_name: packageName,
    },
    data: {},
    queryParams: {},
  });

  return data;
}
