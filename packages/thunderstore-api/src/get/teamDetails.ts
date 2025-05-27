import { ApiEndpointProps } from "../index";
import { apiFetch } from "../apiFetch";
import {
  TeamDetailsResponseData,
  teamDetailsResponseDataSchema,
} from "../schemas/responseSchemas";
import { z } from "zod";
import { TeamDetailsRequestParams } from "../schemas/requestSchemas";

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
    requestSchema: z.object({}),
    queryParamsSchema: z.object({}),
    responseSchema: teamDetailsResponseDataSchema,
  });
}
