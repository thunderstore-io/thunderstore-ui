import {
  ApiEndpointProps,
  ApiError,
  createResourceNotFoundError,
} from "../index";
import { apiFetch } from "../apiFetch";
import {
  TeamMembersResponseData,
  teamMembersResponseDataSchema,
} from "../schemas/responseSchemas";
import { TeamMembersRequestParams } from "../schemas/requestSchemas";

export async function fetchTeamMembers(
  props: ApiEndpointProps<TeamMembersRequestParams, object, object>
): Promise<TeamMembersResponseData> {
  const { config, params } = props;
  const path = `api/cyberstorm/team/${params.team_name}/member/`;

  try {
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
