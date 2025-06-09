import { ApiEndpointProps } from "../index";
import { apiFetch } from "../apiFetch";
import {
  TeamAddMemberRequestData,
  teamAddMemberRequestDataSchema,
} from "../schemas/requestSchemas";
import { TeamAddMemberRequestParams } from "../schemas/requestSchemas";
import {
  TeamAddMemberResponseData,
  teamAddMemberResponseDataSchema,
} from "../schemas/responseSchemas";
import { z } from "zod";

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
    args: {
      config,
      path,
      request: {
        method: "POST",
        body: JSON.stringify(data),
      },
      useSession: true,
    },
    requestSchema: teamAddMemberRequestDataSchema,
    queryParamsSchema: z.object({}),
    responseSchema: teamAddMemberResponseDataSchema,
  });
}
