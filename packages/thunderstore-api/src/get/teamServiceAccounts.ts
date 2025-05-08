import { ApiEndpointProps } from "../index";
import { apiFetch } from "../apiFetch";
import { TeamServiceAccountsRequestParams } from "../schemas/requestSchemas";
import { z } from "zod";
import {
  TeamServiceAccountsResponseData,
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
    requestSchema: z.object({}),
    queryParamsSchema: z.object({}),
    responseSchema: teamServiceAccountsResponseDataSchema,
  });
}
