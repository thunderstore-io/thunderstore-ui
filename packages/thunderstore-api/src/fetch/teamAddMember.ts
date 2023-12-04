import { RequestConfig } from "../index";
import { apiFetch2 } from "../apiFetch";

export type teamAddMemberMetaData = {
  teamIdentifier: string;
};

export type teamAddMemberApiArgs = {
  user: string;
  role: string;
};

export function teamAddMember(
  config: RequestConfig,
  data: teamAddMemberApiArgs,
  metaData: teamAddMemberMetaData
) {
  const path = `/api/cyberstorm/team/${metaData.teamIdentifier}/members/add/`;

  return apiFetch2({
    config,
    path,
    request: {
      method: "POST",
      body: JSON.stringify(data),
    },
  });
}
