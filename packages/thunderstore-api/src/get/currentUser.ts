import { ApiEndpointProps } from "../index";
import { apiFetch } from "../apiFetch";
import {
  CurrentUserResponseData,
  currentUserResponseDataSchema,
} from "../schemas/responseSchemas";

export function fetchCurrentUser(
  props: ApiEndpointProps<object, object, object>
): Promise<CurrentUserResponseData> {
  const { config } = props;
  const path = "api/experimental/current-user/";
  const request = { cache: "no-store" as RequestCache };

  return apiFetch({
    args: { config, path, request, useSession: true },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: currentUserResponseDataSchema,
  });
}
