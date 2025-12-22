import { apiFetch } from "../apiFetch";
import { ApiEndpointProps } from "../index";
import { TeamDetailsRequestParams } from "../schemas/requestSchemas";
import {
  TeamDetailsResponseData,
  teamDetailsResponseDataSchema,
} from "../schemas/responseSchemas";

export async function fetchTeamDetails(
  props: ApiEndpointProps<TeamDetailsRequestParams, object, object>
): Promise<TeamDetailsResponseData> {
  const { config, params } = props;
  const path = `api/cyberstorm/team/${params.team_name}/`;

  return await apiFetch({
    args: {
      config: config,
      path: path,
    },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: teamDetailsResponseDataSchema,
  });
}
