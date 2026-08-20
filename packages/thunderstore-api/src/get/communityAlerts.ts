import { apiFetch } from "../apiFetch";
import type { ApiEndpointProps } from "../index";
import type { CommunityAlertsRequestParams } from "../schemas/requestSchemas";
import {
  type CommunityAlertsResponseData,
  communityAlertsResponseDataSchema,
} from "../schemas/responseSchemas";

export async function fetchCommunityAlerts(
  props: ApiEndpointProps<CommunityAlertsRequestParams, object, object>
): Promise<CommunityAlertsResponseData> {
  const { config, params } = props;
  const path = `api/cyberstorm/community/${params.community_id}/alerts/`;

  return await apiFetch({
    args: {
      config,
      path,
    },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: communityAlertsResponseDataSchema,
  });
}
