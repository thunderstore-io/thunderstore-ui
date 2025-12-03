import { apiFetch } from "../apiFetch";
import { type ApiEndpointProps } from "../index";
import {
  type CommunityFiltersRequestParams,
  communityFiltersRequestParamsSchema,
} from "../schemas/requestSchemas";
import {
  type CommunityFiltersResponseData,
  communityFiltersResponseDataSchema,
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
