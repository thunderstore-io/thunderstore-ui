// THIS API ENDPOINT IS NOT IMPLEMENTED YET IN THE THUNDERSTORE API

import {
  ApiEndpointProps,
  TeamServiceAccountRemoveRequestData,
  teamServiceAccountRemoveRequestDataSchema,
  TeamServiceAccountRemoveRequestParams,
} from "../index";
import { apiFetch } from "../apiFetch";

export function teamServiceAccountRemove(
  props: ApiEndpointProps<
    TeamServiceAccountRemoveRequestParams,
    object,
    TeamServiceAccountRemoveRequestData
  >
): Promise<undefined> {
  const { config, params, data } = props;
  const path = `/api/cyberstorm/team/${params.team_name}/service-account/delete/`;

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
    requestSchema: teamServiceAccountRemoveRequestDataSchema,
    queryParamsSchema: undefined,
    // responseSchema: teamServiceAccountRemoveResponseSchema,
    responseSchema: undefined,
  });
}
