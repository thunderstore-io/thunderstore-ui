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
  version_number: z.union([z.string(), z.literal("latest")]).optional(),
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
  namespace_id: z.string(),
  package_name: z.string(),
  version_number: z.union([z.string(), z.literal("latest")]).optional(),
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

// PackageWikiRequest
export const packageWikiRequestParamsSchema = z.object({
  namespace_id: z.string(),
  package_name: z.string(),
});

export type PackageWikiRequestParams = z.infer<
  typeof packageWikiRequestParamsSchema
>;

// PackageWikiPageRequest
export const packageWikiPageRequestParamsSchema = z.object({
  id: z.string(),
});

export type PackageWikiPageRequestParams = z.infer<
  typeof packageWikiPageRequestParamsSchema
>;

// PackageWikiPageCreateRequest
export const packageWikiPageCreateRequestParamsSchema = z.object({
  namespace_id: z.string(),
  package_name: z.string(),
});

export type PackageWikiPageCreateRequestParams = z.infer<
  typeof packageWikiPageCreateRequestParamsSchema
>;

export const packageWikiPageCreateRequestDataSchema = z.object({
  title: z.string().min(1).max(512),
  markdown_content: z.string().min(1).max(100000),
});

export type PackageWikiPageCreateRequestData = z.infer<
  typeof packageWikiPageCreateRequestDataSchema
>;

// PackageWikiPageEditRequest
export const packageWikiPageEditRequestParamsSchema = z.object({
  namespace_id: z.string(),
  package_name: z.string(),
});

export type PackageWikiPageEditRequestParams = z.infer<
  typeof packageWikiPageEditRequestParamsSchema
>;

export const packageWikiPageEditRequestDataSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(512),
  markdown_content: z.string().min(1).max(100000),
});

export type PackageWikiPageEditRequestData = z.infer<
  typeof packageWikiPageEditRequestDataSchema
>;

// PackageWikiPageDeleteRequest
export const packageWikiPageDeleteRequestParamsSchema = z.object({
  namespace_id: z.string(),
  package_name: z.string(),
});

export type PackageWikiPageDeleteRequestParams = z.infer<
  typeof packageWikiPageDeleteRequestParamsSchema
>;

export const packageWikiPageDeleteRequestDataSchema = z.object({
  id: z.string().min(1),
});

export type PackageWikiPageDeleteRequestData = z.infer<
  typeof packageWikiPageDeleteRequestDataSchema
>;

// PackageSubmissionRequest
export const packageSubmissionRequestDataSchema = z.object({
  author_name: z.string(),
  communities: z.array(z.string()),
  has_nsfw_content: z.boolean(),
  upload_uuid: z.string(),
  categories: z.array(z.string()).optional(),
  community_categories: z.record(z.string(), z.array(z.string())).optional(),
});

export type PackageSubmissionRequestData = z.infer<
  typeof packageSubmissionRequestDataSchema
>;

// PackageSubmissionStatusRequest
export const packageSubmissionStatusRequestParamsSchema = z.object({
  submission_id: z.string(),
});

export type PackageSubmissionStatusRequestParams = z.infer<
  typeof packageSubmissionStatusRequestParamsSchema
>;

// PackageDeprecateRequest
export const packageDeprecateRequestParamsSchema = z.object({
  package: z.string(),
  namespace: z.string(),
});

export type PackageDeprecateRequestParams = z.infer<
  typeof packageDeprecateRequestParamsSchema
>;

export const packageDeprecateRequestDataSchema = z.object({
  deprecate: z.boolean(),
});

export type PackageDeprecateRequestData = z.infer<
  typeof packageDeprecateRequestDataSchema
>;

// PackageUnlistRequest
export const packageUnlistRequestParamsSchema = z.object({
  package: z.string(),
  namespace: z.string(),
  community: z.string(),
});

export type PackageUnlistRequestParams = z.infer<
  typeof packageUnlistRequestParamsSchema
>;

export const packageUnlistRequestDataSchema = z.object({
  unlist: z.literal("unlist"),
});

export type PackageUnlistRequestData = z.infer<
  typeof packageUnlistRequestDataSchema
>;

// PackageListingUpdateRequest
export const packageListingUpdateRequestParamsSchema = z.object({
  community: z.string(),
  namespace: z.string(),
  package: z.string(),
});

export type PackageListingUpdateRequestParams = z.infer<
  typeof packageListingUpdateRequestParamsSchema
>;

export const packageListingUpdateRequestDataSchema = z.object({
  categories: z.array(z.string()),
});

export type PackageListingUpdateRequestData = z.infer<
  typeof packageListingUpdateRequestDataSchema
>;

// PackageRateRequest
export const packageRateRequestParamsSchema = z.object({
  namespace: z.string(),
  package: z.string(),
});

export type PackageRateRequestParams = z.infer<
  typeof packageRateRequestParamsSchema
>;

export const packageRateRequestDataSchema = z.object({
  target_state: z.enum(["rated", "unrated"]),
});

export type PackageRateRequestData = z.infer<
  typeof packageRateRequestDataSchema
>;

// SubmissionValidateManifestRequest
export const submissionValidateManifestRequestDataSchema = z.object({
  namespace: z.string(),
  manifest_data: z.string().min(1),
});

export type SubmissionValidateManifestRequestData = z.infer<
  typeof submissionValidateManifestRequestDataSchema
>;

// MarkdownRenderRequest
export const markdownRenderRequestDataSchema = z.object({
  markdown: z.string().min(1).max(100000),
});

export type MarkdownRenderRequestData = z.infer<
  typeof markdownRenderRequestDataSchema
>;

// PackageListingApproveRequest
export const packageListingApproveRequestParamsSchema = z.object({
  community: z.string(),
  namespace: z.string(),
  package: z.string(),
});

export type PackageListingApproveRequestParams = z.infer<
  typeof packageListingApproveRequestParamsSchema
>;

export const packageListingApproveRequestDataSchema = z.object({
  internal_notes: z.string().optional().nullable(),
});

export type PackageListingApproveRequestData = z.infer<
  typeof packageListingApproveRequestDataSchema
>;

// PackageListingRejectRequest
export const packageListingRejectRequestParamsSchema = z.object({
  community: z.string(),
  namespace: z.string(),
  package: z.string(),
});

export type PackageListingRejectRequestParams = z.infer<
  typeof packageListingRejectRequestParamsSchema
>;

export const packageListingRejectRequestDataSchema = z.object({
  rejection_reason: z.string().min(1),
  internal_notes: z.string().optional().nullable(),
});

export type PackageListingRejectRequestData = z.infer<
  typeof packageListingRejectRequestDataSchema
>;

// PackageListingReportRequest
export const packageListingReportRequestParamsSchema = z.object({
  // This will most likely change to a dedicated cyberstorm endpoint, so the params will change to the commented ones.
  id: z.string(),
  // community: z.string(),
  // namespace: z.string(),
  // package: z.string(),
});

export type PackageListingReportRequestParams = z.infer<
  typeof packageListingReportRequestParamsSchema
>;

export const packageListingReportRequestDataSchema = z.object({
  version: z.number().optional(),
  reason: z.enum([
    "Spam",
    "Malware",
    "Reupload",
    "CopyrightOrLicense",
    "WrongCommunity",
    "WrongCategories",
    "Other",
  ]),
  description: z.string().max(12288).optional().nullable(),
});

export type PackageListingReportRequestData = z.infer<
  typeof packageListingReportRequestDataSchema
>;

// UserLinkedAccountDisconnectRequest
export const userLinkedAccountDisconnectProvidersSchema = z.enum([
  "discord",
  "github",
  "overwolf",
]);

export type userLinkedAccountDisconnectProviders = z.infer<
  typeof userLinkedAccountDisconnectProvidersSchema
>;

export const userLinkedAccountDisconnectRequestParamsSchema = z.object({
  provider: userLinkedAccountDisconnectProvidersSchema,
});

export type UserLinkedAccountDisconnectRequestParams = z.infer<
  typeof userLinkedAccountDisconnectRequestParamsSchema
>;

export const userLinkedAccountDisconnectRequestDataSchema = z.object({
  provider: userLinkedAccountDisconnectProvidersSchema,
});

export type UserLinkedAccountDisconnectRequestData = z.infer<
  typeof userLinkedAccountDisconnectRequestDataSchema
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

// TeamServiceAccountAdd
export const teamServiceAccountAddRequestParamsSchema = z.object({
  team_name: z.string(),
});

export type TeamServiceAccountAddRequestParams = z.infer<
  typeof teamServiceAccountAddRequestParamsSchema
>;

export const teamServiceAccountAddRequestDataSchema = z.object({
  nickname: z.string().min(1),
});

export type TeamServiceAccountAddRequestData = z.infer<
  typeof teamServiceAccountAddRequestDataSchema
>;

// TeamServiceAccountRemoveRequest
export const teamServiceAccountRemoveRequestParamsSchema = z.object({
  team_name: z.string(),
  uuid: z.string(),
});

export type TeamServiceAccountRemoveRequestParams = z.infer<
  typeof teamServiceAccountRemoveRequestParamsSchema
>;

// TeamAddMemberRequest
export const teamAddMemberRequestParamsSchema = z.object({
  team_name: z.string(),
});

export type TeamAddMemberRequestParams = z.infer<
  typeof teamAddMemberRequestParamsSchema
>;

export const teamAddMemberRequestDataSchema = z.object({
  username: z.string().min(1),
  role: z.enum(["owner", "member"]),
});

export type TeamAddMemberRequestData = z.infer<
  typeof teamAddMemberRequestDataSchema
>;

// TeamCreateRequest
export const teamCreateRequestDataSchema = z.object({
  name: z
    .string()
    .regex(/^[a-zA-Z0-9]+([a-zA-Z0-9_]+[a-zA-Z0-9])?$/)
    .max(64)
    .min(1),
});

export type TeamCreateRequestData = z.infer<typeof teamCreateRequestDataSchema>;

// TeamDisbandRequest
export const teamDisbandRequestParamsSchema = z.object({
  team_name: z.string(),
});

export type TeamDisbandRequestParams = z.infer<
  typeof teamDisbandRequestParamsSchema
>;

export const teamDisbandRequestDataSchema = z.object({
  team_name: z.string(),
});

export type TeamDisbandRequestData = z.infer<
  typeof teamDisbandRequestDataSchema
>;

// TeamDetailsEditRequest
export const teamDetailsEditRequestParamsSchema = z.object({
  teamIdentifier: z.string(),
});

export type TeamDetailsEditRequestParams = z.infer<
  typeof teamDetailsEditRequestParamsSchema
>;

export const teamDetailsEditRequestDataSchema = z.object({
  donation_link: z.string().min(1).max(1024),
});

export type TeamDetailsEditRequestData = z.infer<
  typeof teamDetailsEditRequestDataSchema
>;

// TeamMemberEditRequest
export const teamMemberEditRequestParamsSchema = z.object({
  teamIdentifier: z.string(),
  username: z.string(),
});

export type TeamMemberEditRequestParams = z.infer<
  typeof teamMemberEditRequestParamsSchema
>;

export const teamMemberEditRequestDataSchema = z.object({
  role: z.enum(["member", "owner"]),
});

export type TeamMemberEditRequestData = z.infer<
  typeof teamMemberEditRequestDataSchema
>;

// TeamMemberRemoveRequest
export const teamMemberRemoveRequestParamsSchema = z.object({
  team_name: z.string(),
  username: z.string(),
});

export type TeamMemberRemoveRequestParams = z.infer<
  typeof teamMemberRemoveRequestParamsSchema
>;

// PackagePermissionsRequest
export const packagePermissionsRequestParamsSchema = z.object({
  community_id: z.string(),
  namespace_id: z.string(),
  package_name: z.string(),
});

export type PackagePermissionsRequestParams = z.infer<
  typeof packagePermissionsRequestParamsSchema
>;

// PackageSourceRequest
export const packageSourceRequestParamsSchema = z.object({
  namespace_id: z.string(),
  package_name: z.string(),
  version_number: z.union([z.string(), z.literal("latest")]).optional(),
});

export type PackageSourceRequestParams = z.infer<
  typeof packageSourceRequestParamsSchema
>;
