import { ApiEndpointProps } from "../index";
import { apiFetch } from "../apiFetch";
import {
  CommunityListRequestQueryParams,
  communityListRequestQueryParamsSchema,
} from "../schemas/requestSchemas";
import { CommunityListOrderingEnum } from "../schemas/queryParamSchemas";
import {
  communityListResponseDataSchema,
  CommunityListResponseData,
} from "../schemas/responseSchemas";

export function fetchCommunityList(
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

  return apiFetch({
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
