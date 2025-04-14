import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";
import { z } from "zod";
import {
  communityResponseDataSchema,
  CommunityResponseData,
} from "../schemas/responseSchemas";
import { CommunityRequestParams } from "../schemas/requestSchemas";

export async function fetchCommunity(
  config: () => RequestConfig,
  params: CommunityRequestParams
): Promise<CommunityResponseData> {
  const path = `api/cyberstorm/community/${params.community_id}/`;

  return await apiFetch({
    args: {
      config,
      path,
    },
    requestSchema: z.object({}),
    queryParamsSchema: z.object({}),
    responseSchema: communityResponseDataSchema,
  });
}
