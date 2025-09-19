import {
  ApiEndpointProps,
  TeamServiceAccountRemoveRequestParams,
} from "../index";
import { apiFetch } from "../apiFetch";

export function teamServiceAccountRemove(
  props: ApiEndpointProps<TeamServiceAccountRemoveRequestParams, object, object>
): Promise<undefined> {
  const { config, params } = props;
  const path = `/api/cyberstorm/team/${params.team_name}/service-account/delete/${params.uuid}/`;

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
