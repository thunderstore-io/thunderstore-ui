import { apiFetch } from "../apiFetch";
import type {
  ApiEndpointProps,
  TeamMemberEditRequestData,
  TeamMemberEditRequestParams,
} from "../index";
import {
  teamEditMemberResponseSchema,
  teamMemberEditRequestParamsSchema,
} from "../index";

export type teamEditMemberMetaArgs = {
  teamIdentifier: string;
};

export type teamEditMemberApiArgs = {
  username: string;
  role: string;
};

export function teamEditMember(
  props: ApiEndpointProps<
    TeamMemberEditRequestParams,
    object,
    TeamMemberEditRequestData
  >
) {
  const { config, data, params } = props;
  const path = `/api/cyberstorm/team/${params.teamIdentifier}/member/${params.username}/update/`;

  return apiFetch({
    args: {
      config,
      path,
      request: {
        method: "PATCH",
        body: JSON.stringify(data),
      },
      useSession: true,
    },
    requestSchema: teamMemberEditRequestParamsSchema,
    queryParamsSchema: undefined,
    responseSchema: teamEditMemberResponseSchema,
  });
}
