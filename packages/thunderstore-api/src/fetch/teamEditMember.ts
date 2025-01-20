import { RequestConfig } from "../index";
import { apiFetch2 } from "../apiFetch";

export type teamEditMemberMetaArgs = {
  teamIdentifier: string;
};

export type teamEditMemberApiArgs = {
  username: string;
  role: string;
};

export function teamEditMember(
  config: () => RequestConfig,
  data: teamEditMemberApiArgs,
  meta: teamEditMemberMetaArgs
) {
  const path = `/api/cyberstorm/team/${meta.teamIdentifier}/members/edit/`;

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
