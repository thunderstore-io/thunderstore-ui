import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";
import {
  TeamDetailsResponseData,
  teamDetailsResponseDataSchema,
} from "../schemas/responseSchemas";
import { z } from "zod";
import { TeamDetailsRequestParams } from "../schemas/requestSchemas";

export async function fetchTeamDetails(
  config: () => RequestConfig,
  params: TeamDetailsRequestParams
): Promise<TeamDetailsResponseData> {
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
