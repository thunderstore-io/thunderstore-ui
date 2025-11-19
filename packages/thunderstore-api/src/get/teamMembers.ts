import { ApiEndpointProps } from "../index";
import { apiFetch } from "../apiFetch";
import {
  TeamMembersResponseData,
  teamMembersResponseDataSchema,
} from "../schemas/responseSchemas";
import { TeamMembersRequestParams } from "../schemas/requestSchemas";

export function fetchTeamMembers(
  props: ApiEndpointProps<TeamMembersRequestParams, object, object>
): Promise<TeamMembersResponseData> {
  const { config, params } = props;
  const path = `api/cyberstorm/team/${params.team_name}/member/`;

  return apiFetch({
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
