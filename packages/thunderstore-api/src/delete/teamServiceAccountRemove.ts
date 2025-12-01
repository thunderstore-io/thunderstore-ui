import { apiFetch } from "../apiFetch";
import {
  type ApiEndpointProps,
  type TeamServiceAccountRemoveRequestParams,
} from "../index";

export function teamServiceAccountRemove(
  props: ApiEndpointProps<TeamServiceAccountRemoveRequestParams, object, object>
): Promise<undefined> {
  const { config, params } = props;
  const path = `/api/cyberstorm/service-account/${params.uuid}/delete/`;

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
