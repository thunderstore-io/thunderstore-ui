// THIS API ENDPOINT IS NOT IMPLEMENTED YET IN THE THUNDERSTORE API

import {
  ApiEndpointProps,
  UserAccountDeleteRequestData,
  userAccountDeleteRequestDataSchema,
  UserAccountDeleteRequestParams,
} from "../index";
import { apiFetch } from "../apiFetch";

export function userDelete(
  props: ApiEndpointProps<
    UserAccountDeleteRequestParams,
    object,
    UserAccountDeleteRequestData
  >
): Promise<undefined> {
  const { config, params, data } = props;
  const path = `/api/cyberstorm/user/${params.username}/delete/`;

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
    requestSchema: userAccountDeleteRequestDataSchema,
    queryParamsSchema: undefined,
    // responseSchema: userDeleteResponseSchema,
    responseSchema: undefined,
  });
}
