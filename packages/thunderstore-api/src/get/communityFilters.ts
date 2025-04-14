import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";
import { z } from "zod";
import {
  CommunityFiltersRequestParams,
  communityFiltersRequestParamsSchema,
} from "../schemas/requestSchemas";
import {
  communityFiltersResponseDataSchema,
  CommunityFiltersResponseData,
} from "../schemas/responseSchemas";

export async function fetchCommunityFilters(
  config: () => RequestConfig,
  params: CommunityFiltersRequestParams
): Promise<CommunityFiltersResponseData> {
  const path = `api/cyberstorm/community/${params.community_id}/filters/`;

  return await apiFetch({
    args: {
      config,
      path,
    },
    requestSchema: z.object({}),
    queryParamsSchema: communityFiltersRequestParamsSchema,
    responseSchema: communityFiltersResponseDataSchema,
  });
}
