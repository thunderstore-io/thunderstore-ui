import { apiFetch } from "../apiFetch";
import type { ApiEndpointProps } from "../index";
import type {
  CommunityPermissionsRequestParams,
  CommunityRequestParams,
} from "../schemas/requestSchemas";
import {
  type CommunityPermissionsResponseData,
  type CommunityResponseData,
  communityPermissionsResponseDataSchema,
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

// The current user's community-level permissions; used to gate moderator UI on
// the community page. Session + no-store (user-specific, never cached).
export async function fetchCommunityPermissions(
  props: ApiEndpointProps<CommunityPermissionsRequestParams, object, object>
): Promise<CommunityPermissionsResponseData> {
  const { config, params } = props;
  const path = `/api/cyberstorm/community/${params.community}/permissions/`;

  return await apiFetch({
    args: {
      config,
      path,
      request: { cache: "no-store" as RequestCache },
      useSession: true,
    },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: communityPermissionsResponseDataSchema,
  });
}
