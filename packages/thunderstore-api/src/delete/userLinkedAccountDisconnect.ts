import { apiFetch } from "../apiFetch";
import { userLinkedAccountDisconnectRequestDataSchema } from "../index";
import type {
  ApiEndpointProps,
  UserLinkedAccountDisconnectRequestParams,
} from "../index";

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
    config,
    path,
    request: {
      method: "DELETE",
    },
    useSession: true,
    requestSchema: userLinkedAccountDisconnectRequestDataSchema,
    queryParamsSchema: undefined,
    responseSchema: undefined,
  });
}
