import { ApiEndpointProps } from "../index";
import { apiFetch } from "../apiFetch";
import { z } from "zod";
import {
  communityResponseDataSchema,
  CommunityResponseData,
} from "../schemas/responseSchemas";
import { CommunityRequestParams } from "../schemas/requestSchemas";

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
