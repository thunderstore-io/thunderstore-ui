import { RequestConfig } from "../index";
import { apiFetch2 } from "../apiFetch";

export type teamAddMemberMetaArgs = {
  teamIdentifier: string;
};

export type teamAddMemberApiArgs = {
  username: string;
  role: string;
};

export function teamAddMember(
  config: RequestConfig,
  data: teamAddMemberApiArgs,
  meta: teamAddMemberMetaArgs
) {
  const path = `/api/cyberstorm/team/${meta.teamIdentifier}/member/add/`;

  return apiFetch2({
    config,
    path,
    request: {
      method: "POST",
      body: JSON.stringify(data),
    },
    useSession: true,
  });
}
