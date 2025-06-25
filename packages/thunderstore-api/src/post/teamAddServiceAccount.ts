// THIS API ENDPOINT IS NOT IMPLEMENTED YET IN THE THUNDERSTORE API

import {
  ApiEndpointProps,
  TeamServiceAccountAddRequestData,
  teamServiceAccountAddRequestDataSchema,
  TeamServiceAccountAddRequestParams,
  TeamServiceAccountAddResponseData,
  teamServiceAccountAddResponseSchema,
} from "../index";
import { apiFetch } from "../apiFetch";

export type teamAddServiceAccountMetaArgs = {
  teamIdentifier: string;
};

export type teamAddServiceAccountApiArgs = {
  nickname: string;
};

export function teamAddServiceAccount(
  props: ApiEndpointProps<
    TeamServiceAccountAddRequestParams,
    object,
    TeamServiceAccountAddRequestData
  >
): Promise<TeamServiceAccountAddResponseData> {
  const { config, data, params } = props;
  const path = `api/cyberstorm/team/${params.team_name}/service-account/create/`;

  return apiFetch({
    args: {
      config,
      path,
      request: {
        method: "POST",
        body: JSON.stringify(data),
      },
      useSession: true,
    },
    requestSchema: teamServiceAccountAddRequestDataSchema,
    queryParamsSchema: undefined,
    responseSchema: teamServiceAccountAddResponseSchema,
  });
}
