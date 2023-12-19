import { z } from "zod";
import { PackageListingType } from "@thunderstore/dapper/types";
import {
  fetchCommunityPackageListings,
  fetchNamespacePackageListings,
  fetchPackageDependantsListings,
  fetchPackageListingDetails,
} from "@thunderstore/thunderstore-api";
import { PackageListingQueryParams } from "@thunderstore/thunderstore-api/types";

import { membersSchema } from "./team";
import { DapperTsInterface } from "../index";
import { PackageCategory, paginatedResults } from "../sharedSchemas";
import { formatErrorMessage } from "../utils";

const packageListingSchema = z.object({
  categories: PackageCategory.array(),
  community_identifier: z.string().nonempty(),
  description: z.string(),
  download_count: z.number().int().gte(0),
  icon_url: z.string().nullable(),
  is_deprecated: z.boolean(),
  is_nsfw: z.boolean(),
  is_pinned: z.boolean(),
  last_updated: z.string().datetime(),
  name: z.string().nonempty(),
  namespace: z.string().nonempty(),
  rating_count: z.number().int().gte(0),
  size: z.number().int().gt(0),
});

const schema = paginatedResults(packageListingSchema);

export async function getPackageListings(
  this: DapperTsInterface,
  type: PackageListingType,
  ordering = "last-updated",
  page = 1,
  q = "",
  includedCategories: string[] = [],
  excludedCategories: string[] = [],
  section = "",
  nsfw = false,
  deprecated = false
) {
  const options: PackageListingQueryParams = {
    ordering,
    page,
    q,
    includedCategories,
    excludedCategories,
    section,
    nsfw,
    deprecated,
  };
  let data;

  if (type.kind === "community") {
    data = await fetchCommunityPackageListings(
      this.config,
      type.communityId,
      options
    );
  } else if (type.kind === "namespace") {
    data = await fetchNamespacePackageListings(
      this.config,
      type.communityId,
      type.namespaceId,
      options
    );
  } else if (type.kind === "package-dependants") {
    data = await fetchPackageDependantsListings(
      this.config,
      type.communityId,
      type.namespaceId,
      type.packageName,
      options
    );
  } else {
    throw new Error(
      "getPackageListing called with unimplement PackageListingType"
    );
  }

  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    throw new Error(formatErrorMessage(parsed.error));
  }

  return {
    count: parsed.data.count,
    hasMore: Boolean(parsed.data.next),
    results: parsed.data.results,
  };
}

const dependencyShema = z.object({
  community_identifier: z.string().nonempty(),
  description: z.string(),
  icon_url: z.string().nonempty(),
  name: z.string().nonempty(),
  namespace: z.string().nonempty(),
  version_number: z.string().nonempty(),
});

const packageListingDetailSchema = packageListingSchema.extend({
  community_name: z.string().nonempty(),
  datetime_created: z.string().datetime(),
  dependant_count: z.number().int().gte(0),
  dependencies: dependencyShema.array(),
  full_version_name: z.string().nonempty(),
  has_changelog: z.boolean(),
  latest_version_number: z.string().nonempty(),
  team: z.object({
    name: z.string().nonempty(),
    members: membersSchema,
  }),
  website_url: z.string().nonempty().nullable(),
});

export async function getPackageListingDetails(
  this: DapperTsInterface,
  communityId: string,
  namespaceId: string,
  packageName: string
) {
  const data = await fetchPackageListingDetails(
    this.config,
    communityId,
    namespaceId,
    packageName
  );
  const parsed = packageListingDetailSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error(formatErrorMessage(parsed.error));
  }

  return parsed.data;
}
