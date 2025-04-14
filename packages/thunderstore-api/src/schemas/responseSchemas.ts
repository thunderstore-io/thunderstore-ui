import { z } from "zod";
import {
  communitySchema,
  communityFiltersSchema,
  userMediaSchema,
  usermediaUploadPartUrlSchema,
  packageListingSchema,
  userSchema,
  emptyUserSchema,
  packageListingDetailsSchema,
  packageVersionSchema,
  ratedPackagesSchema,
  teamDetailsSchema,
  teamMembersSchema,
  teamServiceAccountSchema,
} from "../schemas/objectSchemas";
import { paginatedResults } from "../schemas/objectSchemas";

// UsermediaInitiateUploadResponse
export const usermediaInitiateUploadResponseDataSchema = z.object({
  user_media: userMediaSchema,
  upload_urls: z.array(usermediaUploadPartUrlSchema),
});

export type UsermediaInitiateUploadResponseData = z.infer<
  typeof usermediaInitiateUploadResponseDataSchema
>;

// UsermediaFinishUploadResponse
export const usermediaFinishUploadResponseDataSchema = userMediaSchema;

export type UsermediaFinishUploadResponseData = z.infer<
  typeof usermediaFinishUploadResponseDataSchema
>;

// UsermediaAbortUploadResponse
export const usermediaAbortUploadResponseDataSchema = userMediaSchema;

export type UsermediaAbortUploadResponseData = z.infer<
  typeof usermediaAbortUploadResponseDataSchema
>;

// CommunityListResponse
export const communityListResponseDataSchema =
  paginatedResults(communitySchema);

export type CommunityListResponseData = z.infer<
  typeof communityListResponseDataSchema
>;

// CommunityResponse
export const communityResponseDataSchema = communitySchema;

export type CommunityResponseData = z.infer<typeof communityResponseDataSchema>;

// CommunityFiltersResponse
export const communityFiltersResponseDataSchema = communityFiltersSchema;

export type CommunityFiltersResponseData = z.infer<
  typeof communityFiltersResponseDataSchema
>;

// PackageListingsResponse
export const packageListingsResponseDataSchema =
  paginatedResults(packageListingSchema);

export type PackageListingsResponseData = z.infer<
  typeof packageListingsResponseDataSchema
>;

// CurrentUserResponse
export const currentUserResponseDataSchema = z.union([
  userSchema,
  emptyUserSchema,
]);

export type CurrentUserResponseData = z.infer<
  typeof currentUserResponseDataSchema
>;

// DynamicHTMLResponse
export const dynamicHTMLResponseDataSchema = z.object({
  dynamic_htmls: z.array(z.string().min(1)),
});

export type DynamicHTMLResponseData = z.infer<
  typeof dynamicHTMLResponseDataSchema
>;

// PackageChangelogResponse
export const packageChangelogResponseDataSchema = z.object({
  html: z.string(),
});

export type PackageChangelogResponseData = z.infer<
  typeof packageChangelogResponseDataSchema
>;

// PackageListingDetailsResponse
export const packageListingDetailsResponseDataSchema =
  packageListingDetailsSchema;

export type PackageListingDetailsResponseData = z.infer<
  typeof packageListingDetailsResponseDataSchema
>;

// PackageReadmeResponse
export const packageReadmeResponseDataSchema = z.object({
  readme: z.string(),
});

export type PackageReadmeResponseData = z.infer<
  typeof packageReadmeResponseDataSchema
>;

// PackageVersionsResponse
export const packageVersionsResponseDataSchema = z.object({
  versions: z.array(packageVersionSchema),
});

export type PackageVersionsResponseData = z.infer<
  typeof packageVersionsResponseDataSchema
>;

// RatedPackagesResponse
export const ratedPackagesResponseDataSchema = ratedPackagesSchema;

export type RatedPackagesResponseData = z.infer<
  typeof ratedPackagesResponseDataSchema
>;

// TeamDetailsResponse
export const teamDetailsResponseDataSchema = teamDetailsSchema;

export type TeamDetailsResponseData = z.infer<
  typeof teamDetailsResponseDataSchema
>;

// TeamMembersResponse
export const teamMembersResponseDataSchema = teamMembersSchema;

export type TeamMembersResponseData = z.infer<
  typeof teamMembersResponseDataSchema
>;

// TeamServiceAccountsResponse
export const teamServiceAccountsResponseDataSchema =
  teamServiceAccountSchema.array();

export type TeamServiceAccountsResponseData = z.infer<
  typeof teamServiceAccountsResponseDataSchema
>;
