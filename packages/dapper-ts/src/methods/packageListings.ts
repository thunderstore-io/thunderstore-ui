// import { z } from "zod";
import { PackageListingType } from "@thunderstore/dapper/types";
import {
  fetchCommunityPackageListings,
  fetchNamespacePackageListings,
  fetchPackageDependantsListings,
  fetchPackageListingDetails,
  // packageListingSchema,
  PackageListingsOrderingEnum,
  PackageListingsRequestQueryParams,
} from "@thunderstore/thunderstore-api";
// import { PackageListingQueryParams } from "@thunderstore/thunderstore-api/schemas/queryParamSchemas";

// import { membersSchema } from "./team";
import { DapperTsInterface } from "../index";
// import { PackageCategory, paginatedResults } from "../sharedSchemas";
// import { formatErrorMessage } from "../utils";

// const packageListingSchema = z.object({
//   categories: PackageCategory.array(),
//   community_identifier: z.string().nonempty(),
//   description: z.string(),
//   download_count: z.number().int().gte(0),
//   icon_url: z.string().nonempty(),
//   is_deprecated: z.boolean(),
//   is_nsfw: z.boolean(),
//   is_pinned: z.boolean(),
//   last_updated: z.string().datetime(),
//   name: z.string().nonempty(),
//   namespace: z.string().nonempty(),
//   rating_count: z.number().int().gte(0),
//   size: z.number().int().gt(0),
// });

// const schema = paginatedResults(packageListingSchema);

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
  if (ordering && ordering in PackageListingsOrderingEnum) {
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

  // ordering: ordering ?? PackageListingsOrderingEnum.Updated,
  // page,
  // q,
  // includedCategories,
  // excludedCategories,
  // section,
  // nsfw,
  // deprecated,

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

  // const parsed = schema.safeParse(data);

  // if (!parsed.success) {
  //   throw new Error(formatErrorMessage(parsed.error));
  // }

  return {
    count: data.count,
    hasMore: Boolean(data.next),
    results: data.results,
  };
}

// export const dependencyShema = z.object({
//   community_identifier: z.string().nonempty(),
//   description: z.string(),
//   icon_url: z.string().nonempty().nullable(),
//   is_active: z.boolean(),
//   name: z.string().nonempty(),
//   namespace: z.string().nonempty(),
//   version_number: z.string().nonempty(),
// });

// const packageListingDetailSchema = packageListingSchema.extend({
//   community_name: z.string().nonempty(),
//   datetime_created: z.string().datetime(),
//   dependant_count: z.number().int().gte(0),
//   dependencies: dependencyShema.array(),
//   dependency_count: z.number().int().gte(0),
//   download_url: z.string().nonempty(),
//   full_version_name: z.string().nonempty(),
//   has_changelog: z.boolean(),
//   install_url: z.string().nonempty(),
//   latest_version_number: z.string().nonempty(),
//   team: z.object({
//     name: z.string().nonempty(),
//     members: membersSchema,
//   }),
//   website_url: z.string().nonempty().nullable(),
// });

export async function getPackageListingDetails(
  this: DapperTsInterface,
  communityId: string,
  namespaceId: string,
  packageName: string
) {
  const data = await fetchPackageListingDetails({
    config: this.config,
    params: {
      community_id: communityId,
      namespace_id: namespaceId,
      package_name: packageName,
    },
    data: {},
    queryParams: {},
  });
  // const parsed = packageListingDetailSchema.safeParse(data);

  // if (!parsed.success) {
  //   throw new Error(formatErrorMessage(parsed.error));
  // }

  return data;
}
