import { apiFetch } from "../apiFetch";
import { type ApiEndpointProps } from "../index";
import {
  type TeamAddMemberRequestData,
  teamAddMemberRequestDataSchema,
} from "../schemas/requestSchemas";
import { type TeamAddMemberRequestParams } from "../schemas/requestSchemas";
import {
  type TeamAddMemberResponseData,
  teamAddMemberResponseDataSchema,
} from "../schemas/responseSchemas";

export function teamAddMember(
  props: ApiEndpointProps<
    TeamAddMemberRequestParams,
    object,
    TeamAddMemberRequestData
  >
): Promise<TeamAddMemberResponseData> {
  const { config, params, data } = props;
  const path = `/api/cyberstorm/team/${params.team_name}/member/add/`;

  return apiFetch({
    config,
    path,
    request: {
      method: "POST",
      body: JSON.stringify(data),
    },
    useSession: true,
    requestSchema: teamAddMemberRequestDataSchema,
    queryParamsSchema: undefined,
    responseSchema: teamAddMemberResponseDataSchema,
  });
}
