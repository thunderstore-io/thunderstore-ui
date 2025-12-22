import { apiFetch } from "../apiFetch";
import { ApiEndpointProps } from "../index";

export function userDelete(
  props: ApiEndpointProps<object, object, object>
): Promise<undefined> {
  const { config } = props;
  const path = `/api/cyberstorm/user/delete/`;

  return apiFetch({
    args: {
      config,
      path,
      request: {
        method: "DELETE",
      },
      useSession: true,
    },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: undefined,
  });
}
