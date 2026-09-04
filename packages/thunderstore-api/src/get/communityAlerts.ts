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
  // Route params are decoded before they reach here, so an identifier can
  // still contain "/", "?", "#" or ".."; apiFetch hands the path to `new URL`,
  // where those would repoint the request. Keep it one segment.
  const communityId = encodeURIComponent(params.community_id);
  const path = `api/cyberstorm/community/${communityId}/alerts/`;

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
