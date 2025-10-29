import {
  ApiEndpointProps,
  ApiError,
  createResourceNotFoundError,
} from "../index";
import { apiFetch } from "../apiFetch";
import { TeamServiceAccountsRequestParams } from "../schemas/requestSchemas";
import {
  TeamServiceAccountsResponseData,
  teamServiceAccountsResponseDataSchema,
} from "../schemas/responseSchemas";

export async function fetchTeamServiceAccounts(
  props: ApiEndpointProps<TeamServiceAccountsRequestParams, object, object>
): Promise<TeamServiceAccountsResponseData> {
  const { config, params } = props;
  const path = `api/cyberstorm/team/${params.team_name}/service-account/`;

  try {
    return await apiFetch({
      args: {
        config: config,
        path: path,
        useSession: true,
      },
      requestSchema: undefined,
      queryParamsSchema: undefined,
      responseSchema: teamServiceAccountsResponseDataSchema,
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
