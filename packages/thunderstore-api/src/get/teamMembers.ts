import { apiFetch } from "../apiFetch";
import type { ApiEndpointProps } from "../index";
import type { TeamMembersRequestParams } from "../schemas/requestSchemas";
import {
  type TeamMembersResponseData,
  teamMembersResponseDataSchema,
} from "../schemas/responseSchemas";

export async function fetchTeamMembers(
  props: ApiEndpointProps<TeamMembersRequestParams, object, object>
): Promise<TeamMembersResponseData> {
  const { config, params } = props;
  const path = `api/cyberstorm/team/${params.team_name}/member/`;

  return await apiFetch({
    args: {
      config: config,
      path: path,
      useSession: true,
    },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: teamMembersResponseDataSchema,
  });
}
