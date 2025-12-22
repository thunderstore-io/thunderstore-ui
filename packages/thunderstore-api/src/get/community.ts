import { apiFetch } from "../apiFetch";
import { ApiEndpointProps } from "../index";
import { CommunityRequestParams } from "../schemas/requestSchemas";
import {
  CommunityResponseData,
  communityResponseDataSchema,
} from "../schemas/responseSchemas";

export async function fetchCommunity(
  props: ApiEndpointProps<CommunityRequestParams, object, object>
): Promise<CommunityResponseData> {
  const { config, params } = props;
  const path = `api/cyberstorm/community/${params.community_id}/`;

  return await apiFetch({
    args: {
      config,
      path,
    },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: communityResponseDataSchema,
  });
}
