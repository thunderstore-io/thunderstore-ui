// THIS API ENDPOINT IS NOT IMPLEMENTED YET IN THE THUNDERSTORE API

import {
  ApiEndpointProps,
  UserLinkedAccountDisconnectRequestParams,
} from "../index";
import { apiFetch } from "../apiFetch";

export function userLinkedAccountDisconnect(
  props: ApiEndpointProps<
    UserLinkedAccountDisconnectRequestParams,
    object,
    object
  >
): Promise<undefined> {
  const { config, params, data } = props;
  const path = `/api/cyberstorm/user/${params.user}/social-account/${params.provider}/delete/`;

  return apiFetch({
    args: {
      config,
      path,
      request: {
        method: "DELETE",
        body: JSON.stringify(data),
      },
      useSession: true,
    },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: undefined,
  });
}
