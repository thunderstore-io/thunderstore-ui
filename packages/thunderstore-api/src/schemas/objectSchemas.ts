import { z } from "zod";

export type GenericApiError = {
  detail?: string;
};

export const paginatedResults = <T extends z.ZodTypeAny>(resultType: T) =>
  z.object({
    count: z.number().int().min(0),
    next: z.string().url().nullable(),
    previous: z.string().url().nullable(),
    results: z.array(resultType),
  });

export const userMediaSchema = z.object({
  uuid: z.string(),
  datetime_created: z.string(),
  expiry: z.string(),
  status: z.string(),
  filename: z.string(),
  size: z.number(),
});

export type UserMedia = z.infer<typeof userMediaSchema>;

export const usermediaUploadPartUrlSchema = z.object({
  part_number: z.number(),
  url: z.string(),
  offset: z.number(),
  length: z.number(),
});

export type UsermediaUploadPartUrl = z.infer<
  typeof usermediaUploadPartUrlSchema
>;

export const usermediaCompletedPartSchema = z.object({
  ETag: z.string(),
  PartNumber: z.number(),
});

export type UsermediaCompletedPart = z.infer<
  typeof usermediaCompletedPartSchema
>;

export const communitySchema = z.object({
  name: z.string().min(1),
  identifier: z.string().min(1),
  short_description: z.string().nullable(),
  description: z.string().nullable(),
  wiki_url: z.string().nullable(),
  discord_url: z.string().nullable(),
  datetime_created: z.string().datetime(),
  hero_image_url: z.string().url().nullable(),
  cover_image_url: z.string().url().nullable(),
  icon_url: z.string().url().nullable(),
  community_icon_url: z.string().url().nullable(),
  total_download_count: z.number().int(),
  total_package_count: z.number().int(),
});

export type Community = z.infer<typeof communitySchema>;

export const sectionSchema = z.object({
  uuid: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  priority: z.number().int(),
});

export type Section = z.infer<typeof sectionSchema>;

export const packageCategoryPartialSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
});

export type PackageCategoryPartial = z.infer<
  typeof packageCategoryPartialSchema
>;

export const packageCategorySchema = packageCategoryPartialSchema.extend({
  id: z.string().min(1),
});

export type PackageCategory = z.infer<typeof packageCategorySchema>;

export const communityFiltersSchema = z.object({
  package_categories: packageCategorySchema.array(),
  sections: sectionSchema.array(),
});

export type CommunityFilters = z.infer<typeof communityFiltersSchema>;

export const serviceAccountSchema = z.object({
  identifier: z.string().min(1),
  name: z.string().min(1),
  last_used: z.string().datetime().nullable(),
});

export type ServiceAccount = z.infer<typeof serviceAccountSchema>;

export const teamDetailsSchema = z.object({
  identifier: z.number().int(),
  name: z.string().min(1),
  donation_link: z.string().url().nullable(),
});

export type TeamDetails = z.infer<typeof teamDetailsSchema>;

export const teamMemberSchema = z.object({
  identifier: z.number().int(),
  username: z.string().min(1),
  avatar: z.string().url().nullable(),
  role: z.enum(["owner", "member"]),
});

export type TeamMember = z.infer<typeof teamMemberSchema>;

export const packageListingSchema = z.object({
  categories: packageCategorySchema.array(),
  community_identifier: z.string().min(1),
  description: z.string(),
  download_count: z.number().int(),
  icon_url: z.string().url().nullable(),
  is_deprecated: z.boolean(),
  is_nsfw: z.boolean(),
  is_pinned: z.boolean(),
  last_updated: z.string().datetime(),
  name: z.string().min(1),
  namespace: z.string().min(1),
  rating_count: z.number().int(),
  size: z.number().int(),
});

export type PackageListing = z.infer<typeof packageListingSchema>;

const packageTeamSchema = z.object({
  name: z.string().min(1),
  members: teamMemberSchema.array(),
});

export type PackageTeam = z.infer<typeof packageTeamSchema>;

export const packageDependencySchema = z.object({
  community_identifier: z.string().min(1),
  description: z.string(),
  icon_url: z.string().url().nullable(),
  is_active: z.boolean(),
  name: z.string().min(1),
  namespace: z.string().min(1),
  version_number: z.string().min(1),
});

export type PackageDependency = z.infer<typeof packageDependencySchema>;

export const packageListingDetailsSchema = packageListingSchema.extend({
  community_name: z.string().min(1),
  datetime_created: z.string().datetime(),
  dependant_count: z.number().int(),
  dependencies: z.array(packageDependencySchema),
  dependency_count: z.number().int(),
  download_url: z.string().url(),
  full_version_name: z.string().min(1),
  has_changelog: z.boolean(),
  install_url: z.string().url(),
  latest_version_number: z.string().min(1),
  team: packageTeamSchema,
  website_url: z.string().url().nullable(),
});

export type PackageListingDetails = z.infer<typeof packageListingDetailsSchema>;

export const packageVersionSchema = z.object({
  version_number: z.string().min(1),
  datetime_created: z.string().datetime(),
  download_count: z.number().int(),
  download_url: z.string().url(),
  install_url: z.string().url(),
});

export type PackageVersion = z.infer<typeof packageVersionSchema>;

export const packageVersionExperimentalSchema = z.object({
  namespace: z.string().min(1),
  name: z.string().min(1).max(128),
  version_number: z.string().min(1).max(16),
  full_name: z.string(),
  description: z.string().max(256),
  icon: z.string().url(),
  dependencies: z.string().array(),
  download_url: z.string().url(),
  downloads: z.number().int(),
  date_created: z.string().datetime(),
  website_url: z.string().url(),
  is_active: z.boolean(),
});

export type PackageVersionExperimental = z.infer<
  typeof packageVersionExperimentalSchema
>;

export const packageSubmissionErrorSchema = z.object({
  upload_uuid: z.string().array().nullable().optional(),
  author_name: z.string().array().nullable().optional(),
  categories: z.string().array().nullable().optional(),
  communities: z.string().array().nullable().optional(),
  has_nsfw_content: z.string().array().nullable().optional(),
  detail: z.string().array().nullable().optional(),
  file: z.string().array().nullable().optional(),
  team: z.string().array().nullable().optional(),
  __all__: z.string().array().nullable().optional(),
});

export type PackageSubmissionError = z.infer<
  typeof packageSubmissionErrorSchema
>;

export const packageSubmissionCommunitySchema = z.object({
  identifier: z.string().min(1).max(256),
  name: z.string().min(1).max(256),
  discord_url: z.string().url().max(512).nullable(),
  wiki_url: z.string().url().max(512).nullable(),
  require_package_listing_approval: z.boolean(),
});

export type PackageSubmissionCommunity = z.infer<
  typeof packageSubmissionCommunitySchema
>;

export const availableCommunitySchema = z.object({
  community: packageSubmissionCommunitySchema,
  categories: packageCategoryPartialSchema.array(),
  url: z.string().url(),
});

export type AvailableCommunity = z.infer<typeof availableCommunitySchema>;

export const packageSubmissionResultSchema = z.object({
  package_version: packageVersionExperimentalSchema,
  available_communities: z.array(availableCommunitySchema),
});

export type PackageSubmissionResult = z.infer<
  typeof packageSubmissionResultSchema
>;

export const packageSubmissionStatusSchema = z.object({
  id: z.string().min(1),
  status: z.string().min(1),
  form_errors: packageSubmissionErrorSchema.nullable(),
  task_error: z.boolean().nullable(),
  result: packageSubmissionResultSchema.nullable(),
});

export type PackageSubmissionStatus = z.infer<
  typeof packageSubmissionStatusSchema
>;

export const oAuthConnectionSchema = z.object({
  provider: z.string().min(1),
  username: z.string().min(1),
  avatar: z.string().url().nullable(),
});

export const userTeamSchema = z.object({
  name: z.string().min(1),
  role: z.union([z.literal("owner"), z.literal("member")]),
  member_count: z.number().int().gte(1),
});

export const emptyUserSchema = z.object({
  username: z.null(),
  capabilities: z.array(z.string()),
  connections: z.array(oAuthConnectionSchema),
  subscription: z.object({
    expires: z.string().datetime().nullable(),
  }),
  teams: z.array(z.string()).or(z.array(userTeamSchema)),
  teams_full: z.array(userTeamSchema).nullable().optional(),
});

export type EmptyUser = z.infer<typeof emptyUserSchema>;

export const userSchema = z.object({
  username: z.string().min(1),
  capabilities: z.string().array(),
  connections: oAuthConnectionSchema.array(),
  subscription: z.object({
    expires: z.string().datetime().nullable(),
  }),
  teams: z.array(z.string()).or(z.array(userTeamSchema)),
  teams_full: z.array(userTeamSchema).nullable().optional(),
});

export type User = z.infer<typeof userSchema>;

export const ratedPackagesSchema = z.object({
  rated_packages: z.string().array(),
});

export type RatedPackages = z.infer<typeof ratedPackagesSchema>;

export const teamMembersSchema = teamMemberSchema.array();

export type TeamMembers = z.infer<typeof teamMembersSchema>;

export const teamServiceAccountSchema = z.object({
  identifier: z.string().uuid(),
  name: z.string().nonempty(),
  last_used: z.string().datetime().nullable(),
});

export type TeamServiceAccount = z.infer<typeof teamServiceAccountSchema>;

export const markdownRenderSchema = z.object({
  html: z.string(),
});

export type MarkdownRender = z.infer<typeof markdownRenderSchema>;
