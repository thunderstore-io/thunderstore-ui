import { apiFetch } from "../apiFetch";
import { type ApiEndpointProps } from "../index";
import { type TeamServiceAccountsRequestParams } from "../schemas/requestSchemas";
import {
  type TeamServiceAccountsResponseData,
  teamServiceAccountsResponseDataSchema,
} from "../schemas/responseSchemas";

export async function fetchTeamServiceAccounts(
  props: ApiEndpointProps<TeamServiceAccountsRequestParams, object, object>
): Promise<TeamServiceAccountsResponseData> {
  const { config, params } = props;
  const path = `api/cyberstorm/team/${params.team_name}/service-account/`;

  return await apiFetch({
    args: {
      config,
      path,
      useSession: true,
    },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: teamServiceAccountsResponseDataSchema,
  });
}
