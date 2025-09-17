import {
  ApiEndpointProps,
  UserLinkedAccountDisconnectRequestParams,
  userLinkedAccountDisconnectRequestParamsSchema,
} from "../index";
import { apiFetch } from "../apiFetch";

export function userLinkedAccountDisconnect(
  props: ApiEndpointProps<
    UserLinkedAccountDisconnectRequestParams,
    object,
    object
  >
): Promise<undefined> {
  const { config, params } = props;
  const path = `/api/cyberstorm/user/linked-account/${params.provider}/disconnect/`;

  return apiFetch({
    args: {
      config,
      path,
      request: {
        method: "DELETE",
      },
      useSession: true,
    },
    requestSchema: userLinkedAccountDisconnectRequestParamsSchema,
    queryParamsSchema: undefined,
    responseSchema: undefined,
  });
}
