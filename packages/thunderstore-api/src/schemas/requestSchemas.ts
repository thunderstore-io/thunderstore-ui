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

// PackageListingsRequest
export const packageListingsRequestParamsSchema = z.object({
  community_id: z.string(),
});

export type PackageListingsRequestParams = z.infer<
  typeof packageListingsRequestParamsSchema
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
