import { apiFetch } from "../apiFetch";
import { ApiEndpointProps } from "../index";
import {
  type CurrentUserTeamPermissionsRequestParams,
  currentUserTeamPermissionsRequestParamsSchema,
} from "../schemas/requestSchemas";
import {
  CurrentUserResponseData,
  CurrentUserTeamPermissionsResponseData,
  currentUserResponseDataSchema,
  currentUserTeamPermissionsResponseDataSchema,
} from "../schemas/responseSchemas";

export async function fetchCurrentUser(
  props: ApiEndpointProps<object, object, object>
): Promise<CurrentUserResponseData> {
  const { config } = props;
  const path = "api/experimental/current-user/";
  const request = { cache: "no-store" as RequestCache };

  return await apiFetch({
    args: { config, path, request, useSession: true },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: currentUserResponseDataSchema,
  });
}

export async function fetchCurrentUserTeamPermissions(
  props: ApiEndpointProps<
    CurrentUserTeamPermissionsRequestParams,
    object,
    object
  >
): Promise<CurrentUserTeamPermissionsResponseData> {
  const { config, params } = props;
  const path = `api/experimental/current-user/permissions/team/${params.team_name}/`;
  const request = { cache: "no-store" as RequestCache };

  return await apiFetch({
    args: { config, path, request, useSession: true },
    requestSchema: currentUserTeamPermissionsRequestParamsSchema,
    queryParamsSchema: undefined,
    responseSchema: currentUserTeamPermissionsResponseDataSchema,
  });
}
