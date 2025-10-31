import { ApiEndpointProps } from "../index";
import { apiFetch } from "../apiFetch";
import {
  CommunityFiltersRequestParams,
  communityFiltersRequestParamsSchema,
} from "../schemas/requestSchemas";
import {
  communityFiltersResponseDataSchema,
  CommunityFiltersResponseData,
} from "../schemas/responseSchemas";

export function fetchCommunityFilters(
  props: ApiEndpointProps<CommunityFiltersRequestParams, object, object>
): Promise<CommunityFiltersResponseData> {
  const { config, params } = props;
  const path = `api/cyberstorm/community/${params.community_id}/filters/`;

  return apiFetch({
    args: {
      config,
      path,
    },
    requestSchema: undefined,
    queryParamsSchema: communityFiltersRequestParamsSchema,
    responseSchema: communityFiltersResponseDataSchema,
  });
}
