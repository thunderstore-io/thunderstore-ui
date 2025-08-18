import { ApiEndpointProps } from "../index";
import { apiFetch } from "../apiFetch";
import {
  TeamCreateRequestData,
  teamCreateRequestDataSchema,
} from "../schemas/requestSchemas";
import {
  TeamCreateResponseData,
  teamCreateResponseDataSchema,
} from "../schemas/responseSchemas";

export function teamCreate(
  props: ApiEndpointProps<object, object, TeamCreateRequestData>
): Promise<TeamCreateResponseData> {
  const { config, data } = props;
  const path = "api/cyberstorm/team/create/";

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
    requestSchema: teamCreateRequestDataSchema,
    queryParamsSchema: undefined,
    responseSchema: teamCreateResponseDataSchema,
  });
}
