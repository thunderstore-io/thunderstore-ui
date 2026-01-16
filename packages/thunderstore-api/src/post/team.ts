import { apiFetch } from "../apiFetch";
import type { ApiEndpointProps } from "../index";
import { teamCreateRequestDataSchema } from "../schemas/requestSchemas";
import type { TeamCreateRequestData } from "../schemas/requestSchemas";
import { teamCreateResponseDataSchema } from "../schemas/responseSchemas";
import type { TeamCreateResponseData } from "../schemas/responseSchemas";

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
