import { apiFetch } from "../apiFetch";
import type { ApiEndpointProps } from "../index";
import type { TeamCommunitiesRequestParams } from "../schemas/requestSchemas";
import {
  type TeamCommunitiesResponseData,
  teamCommunitiesResponseDataSchema,
} from "../schemas/responseSchemas";

/**
 * Fetch the communities a team has publicly visible packages in
 *
 * @param props The request config and the team name
 * @returns The team's communities with their package counts
 */
export async function fetchTeamCommunities(
  props: ApiEndpointProps<TeamCommunitiesRequestParams, object, object>
): Promise<TeamCommunitiesResponseData> {
  const { config, params } = props;
  const path = `api/cyberstorm/team/${params.team_name}/communities/`;

  return await apiFetch({
    args: {
      config: config,
      path: path,
    },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: teamCommunitiesResponseDataSchema,
  });
}
