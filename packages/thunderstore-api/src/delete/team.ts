import { ApiEndpointProps } from "../index";
import { apiFetch } from "../apiFetch";
import { TeamDisbandRequestParams } from "../schemas/requestSchemas";
import { z } from "zod";

export function teamDisband(
  props: ApiEndpointProps<TeamDisbandRequestParams, object, object>
) {
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
    requestSchema: z.object({}),
    queryParamsSchema: z.object({}),
    responseSchema: z.object({}),
  });
}
