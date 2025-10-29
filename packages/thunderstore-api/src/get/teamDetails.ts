import {
  ApiEndpointProps,
  ApiError,
  createResourceNotFoundError,
} from "../index";
import { apiFetch } from "../apiFetch";
import {
  TeamDetailsResponseData,
  teamDetailsResponseDataSchema,
} from "../schemas/responseSchemas";
import { TeamDetailsRequestParams } from "../schemas/requestSchemas";

export async function fetchTeamDetails(
  props: ApiEndpointProps<TeamDetailsRequestParams, object, object>
): Promise<TeamDetailsResponseData> {
  const { config, params } = props;
  const path = `api/cyberstorm/team/${params.team_name}/`;

  try {
    return await apiFetch({
      args: {
        config: config,
        path: path,
      },
      requestSchema: undefined,
      queryParamsSchema: undefined,
      responseSchema: teamDetailsResponseDataSchema,
    });
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      throw createResourceNotFoundError({
        resourceName: "team",
        identifier: params.team_name,
        description: "We could not find the requested team.",
        originalError: error,
        context: {
          ...error.context,
          statusText: error.statusText,
        },
      });
    }
    throw error;
  }
}
