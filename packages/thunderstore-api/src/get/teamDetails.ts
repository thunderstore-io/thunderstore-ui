import { ApiEndpointProps } from "../index";
import { apiFetch } from "../apiFetch";
import {
  TeamDetailsResponseData,
  teamDetailsResponseDataSchema,
} from "../schemas/responseSchemas";
import { TeamDetailsRequestParams } from "../schemas/requestSchemas";

export function fetchTeamDetails(
  props: ApiEndpointProps<TeamDetailsRequestParams, object, object>
): Promise<TeamDetailsResponseData> {
  const { config, params } = props;
  const path = `api/cyberstorm/team/${params.team_name}/`;
  return apiFetch({
    args: {
      config: config,
      path: path,
    },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: teamDetailsResponseDataSchema,
  });
}
