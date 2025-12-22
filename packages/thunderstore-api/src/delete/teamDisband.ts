import { apiFetch } from "../apiFetch";
import type { ApiEndpointProps } from "../index";
import type { TeamDisbandRequestParams } from "../schemas/requestSchemas";

export function teamDisband(
  props: ApiEndpointProps<TeamDisbandRequestParams, object, object>
): Promise<undefined> {
  const { config, params } = props;
  const path = `/api/cyberstorm/team/${params.team_name}/disband/`;

  return apiFetch({
    args: {
      config,
      path,
      request: {
        method: "DELETE",
      },
      useSession: true,
    },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: undefined,
  });
}
