import { apiFetch } from "../apiFetch";
import { type ApiEndpointProps } from "../index";
import {
  type TeamCreateRequestData,
  teamCreateRequestDataSchema,
} from "../schemas/requestSchemas";
import {
  type TeamCreateResponseData,
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
