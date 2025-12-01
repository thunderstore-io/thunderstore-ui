import { apiFetch } from "../apiFetch";
import { type ApiEndpointProps } from "../index";
import { CommunityListOrderingEnum } from "../schemas/queryParamSchemas";
import {
  type CommunityListRequestQueryParams,
  communityListRequestQueryParamsSchema,
} from "../schemas/requestSchemas";
import {
  type CommunityListResponseData,
  communityListResponseDataSchema,
} from "../schemas/responseSchemas";

export async function fetchCommunityList(
  props: ApiEndpointProps<object, CommunityListRequestQueryParams, object>
): Promise<CommunityListResponseData> {
  const {
    config,
    queryParams = [
      {
        key: "ordering",
        value: CommunityListOrderingEnum.Name,
        impotent: CommunityListOrderingEnum.Name,
      },
      { key: "page", value: 1, impotent: 1 },
      { key: "search", value: undefined },
    ],
  } = props;
  const path = "api/cyberstorm/community/";

  return await apiFetch({
    args: {
      config,
      path,
      queryParams,
    },
    requestSchema: undefined,
    queryParamsSchema: communityListRequestQueryParamsSchema,
    responseSchema: communityListResponseDataSchema,
  });
}
