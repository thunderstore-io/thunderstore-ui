import { RequestConfig } from "../index";
import { apiFetch2 } from "../apiFetch";

export type teamEditMemberMetaData = {
  teamIdentifier: string;
};

export type teamEditMemberApiArgs = {
  user: string;
  role: string;
};

export function teamEditMember(
  config: RequestConfig,
  data: teamEditMemberApiArgs,
  metaData: teamEditMemberMetaData
) {
  const path = `/api/cyberstorm/team/${metaData.teamIdentifier}/members/edit/`;

  return apiFetch2({
    config,
    path,
    request: {
      method: "POST",
      body: JSON.stringify(data),
    },
  });
}
