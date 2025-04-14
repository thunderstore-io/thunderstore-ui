import { z } from "zod";
import { usermediaCompletedPartSchema } from "./objectSchemas";
import {
  CommunityListOrderingEnum,
  communityListOrderingQueryParam,
  includedCategoriesQueryParam,
  deprecatedQueryParam,
  excludedCategoriesQueryParam,
  nsfwQueryParam,
  pageQueryParam,
  qQueryParam,
  searchQueryParam,
  sectionQueryParam,
  packageListingsOrderingQueryParam,
} from "./queryParamSchemas";

// UsermediaInitiateUploadRequest
export const usermediaInitiateUploadRequestDataSchema = z.object({
  filename: z.string(),
  file_size_bytes: z.number(),
});

export type UsermediaInitiateUploadRequestData = z.infer<
  typeof usermediaInitiateUploadRequestDataSchema
>;

// UsermediaFinishUploadRequest
export const usermediaFinishUploadRequestParamsSchema = z.object({
  uuid: z.string(),
});

export type UsermediaFinishUploadRequestParams = z.infer<
  typeof usermediaFinishUploadRequestParamsSchema
>;

export const usermediaFinishUploadRequestDataSchema = z.object({
  parts: z.array(usermediaCompletedPartSchema),
});

export type UsermediaFinishUploadRequestData = z.infer<
  typeof usermediaFinishUploadRequestDataSchema
>;

// UsermediaAbortUploadRequest
export const usermediaAbortUploadRequestParamsSchema = z.object({
  uuid: z.string(),
});

export type UsermediaAbortUploadRequestParams = z.infer<
  typeof usermediaAbortUploadRequestParamsSchema
>;

// CommunityListRequest
export const communityListRequestQueryParamsSchema = z.array(
  z.union([pageQueryParam, searchQueryParam, communityListOrderingQueryParam])
);

export type CommunityListRequestQueryParams = z.infer<
  typeof communityListRequestQueryParamsSchema
>;

export const communityListRequestParamsSchema = z
  .object({
    page: z.number().int(),
    ordering: z.nativeEnum(CommunityListOrderingEnum),
    search: z.string().optional(),
  })
  .array();

export type CommunityListRequestParams = z.infer<
  typeof communityListRequestParamsSchema
>;

// CommunityRequest
export const communityRequestParamsSchema = z.object({
  community_id: z.string(),
});

export type CommunityRequestParams = z.infer<
  typeof communityRequestParamsSchema
>;

// CommunityFiltersRequest
export const communityFiltersRequestParamsSchema = z.object({
  community_id: z.string(),
});

export type CommunityFiltersRequestParams = z.infer<
  typeof communityFiltersRequestParamsSchema
>;

// CommunityPackageListingsRequest
export const communityPackageListingsRequestParamsSchema = z.object({
  community_id: z.string(),
});

export type CommunityPackageListingsRequestParams = z.infer<
  typeof communityPackageListingsRequestParamsSchema
>;

export const packageListingsRequestQueryParamsSchema = z.array(
  z.union([
    includedCategoriesQueryParam,
    excludedCategoriesQueryParam,
    sectionQueryParam,
    nsfwQueryParam,
    deprecatedQueryParam,
    qQueryParam,
    packageListingsOrderingQueryParam,
    pageQueryParam,
  ])
);

export type PackageListingsRequestQueryParams = z.infer<
  typeof packageListingsRequestQueryParamsSchema
>;

// DynamicHTMLRequest
export const dynamicHTMLRequestParamsSchema = z.object({
  placement: z.string(),
});

export type DynamicHTMLRequestParams = z.infer<
  typeof dynamicHTMLRequestParamsSchema
>;

// NamespacePackageListingsRequest
export const namespacePackageListingsRequestParamsSchema = z.object({
  community_id: z.string(),
  namespace_id: z.string(),
});

export type NamespacePackageListingsRequestParams = z.infer<
  typeof namespacePackageListingsRequestParamsSchema
>;

// PackageChangelogRequest
export const packageChangelogRequestParamsSchema = z.object({
  namespace_id: z.string(),
  package_name: z.string(),
  version_number: z.union([z.string(), z.literal("latest")]),
});

export type PackageChangelogRequestParams = z.infer<
  typeof packageChangelogRequestParamsSchema
>;

// PackageDependantsListingsRequest
export const packageDependantsListingsRequestParamsSchema = z.object({
  community_id: z.string(),
  namespace_id: z.string(),
  package_name: z.string(),
});

export type PackageDependantsListingsRequestParams = z.infer<
  typeof packageDependantsListingsRequestParamsSchema
>;

// PackageListingDetailsRequest
export const packageListingDetailsRequestParamsSchema = z.object({
  community_id: z.string(),
  namespace_id: z.string(),
  package_name: z.string(),
});

export type PackageListingDetailsRequestParams = z.infer<
  typeof packageListingDetailsRequestParamsSchema
>;

// PackageReadmeRequest
export const packageReadmeRequestParamsSchema = z.object({
  community_id: z.string(),
  namespace_id: z.string(),
  package_name: z.string(),
  version_number: z.union([z.string(), z.literal("latest")]),
});

export type PackageReadmeRequestParams = z.infer<
  typeof packageReadmeRequestParamsSchema
>;

// PackageVersionsRequest
export const packageVersionsRequestParamsSchema = z.object({
  namespace_id: z.string(),
  package_name: z.string(),
});

export type PackageVersionsRequestParams = z.infer<
  typeof packageVersionsRequestParamsSchema
>;

// TeamDetailsRequest
export const teamDetailsRequestParamsSchema = z.object({
  team_name: z.string(),
});

export type TeamDetailsRequestParams = z.infer<
  typeof teamDetailsRequestParamsSchema
>;

// TeamMembersRequest
export const teamMembersRequestParamsSchema = z.object({
  team_name: z.string(),
});

export type TeamMembersRequestParams = z.infer<
  typeof teamMembersRequestParamsSchema
>;

// TeamServiceAccountsRequest
export const teamServiceAccountsRequestParamsSchema = z.object({
  team_name: z.string(),
});

export type TeamServiceAccountsRequestParams = z.infer<
  typeof teamServiceAccountsRequestParamsSchema
>;

// PackageSubmissionRequest
export const packageSubmissionRequestParamsSchema = z.object({
  useSession: z.boolean(),
  submission_id: z.string(),
});

export type PackageSubmissionRequestParams = z.infer<
  typeof packageSubmissionRequestParamsSchema
>;
