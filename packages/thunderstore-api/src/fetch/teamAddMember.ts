import { RequestConfig } from "../index";
import { apiFetch2 } from "../apiFetch";

export type teamAddMemberMetaArgs = {
  teamIdentifier: string;
};

export type teamAddMemberApiArgs = {
  user: string;
  role: string;
};

export function teamAddMember(
  config: RequestConfig,
  data: teamAddMemberApiArgs,
  meta: teamAddMemberMetaArgs
) {
  const path = `/api/cyberstorm/team/${meta.teamIdentifier}/members/add/`;

  return apiFetch2({
    config,
    path,
    request: {
      method: "POST",
      body: JSON.stringify(data),
    },
  });
}
