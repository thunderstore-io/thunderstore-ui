import { ApiEndpointProps, TeamMemberRemoveRequestParams } from "../index";
import { apiFetch } from "../apiFetch";

export function teamRemoveMember(
  props: ApiEndpointProps<TeamMemberRemoveRequestParams, object, object>
) {
  const { config, params } = props;
  const path = `/api/cyberstorm/team/${params.team_name}/member/${params.username}/remove/`;

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
