import { ApiEndpointProps } from "../index";
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
  props: ApiEndpointProps<CommunityFiltersRequestParams, object, object>
): Promise<CommunityFiltersResponseData> {
  const { config, params } = props;
  const path = `api/cyberstorm/community/${params.community_id}/filters/`;

  return await apiFetch({
    args: {
      config,
      path,
    },
    requestSchema: undefined,
    queryParamsSchema: communityFiltersRequestParamsSchema,
    responseSchema: communityFiltersResponseDataSchema,
  });
}
