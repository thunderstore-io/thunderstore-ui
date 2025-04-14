import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";
import {
  CommunityListRequestQueryParams,
  communityListRequestQueryParamsSchema,
} from "../schemas/requestSchemas";
import { CommunityListOrderingEnum } from "../schemas/queryParamSchemas";
import { z } from "zod";
import {
  communityListResponseDataSchema,
  CommunityListResponseData,
} from "../schemas/responseSchemas";

export async function fetchCommunityList(
  config: () => RequestConfig,
  queryParams: CommunityListRequestQueryParams = [
    {
      key: "ordering",
      value: CommunityListOrderingEnum.Name,
      impotent: CommunityListOrderingEnum.Name,
    },
    { key: "page", value: 1, impotent: 1 },
    { key: "search", value: undefined },
  ]
): Promise<CommunityListResponseData> {
  const path = "api/cyberstorm/community/";

  return await apiFetch({
    args: {
      config,
      path,
      queryParams,
    },
    requestSchema: z.object({}),
    queryParamsSchema: communityListRequestQueryParamsSchema,
    responseSchema: communityListResponseDataSchema,
  });
}
