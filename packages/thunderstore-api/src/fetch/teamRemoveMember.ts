import { RequestConfig } from "../index";
import { apiFetch2 } from "../apiFetch";

export type teamRemoveMemberMetaData = {
  teamIdentifier: string;
  user: string;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface teamRemoveMemberApiArgs {}

export function teamRemoveMember(
  config: RequestConfig,
  data: teamRemoveMemberApiArgs,
  metaData: teamRemoveMemberMetaData
) {
  const path = `/api/cyberstorm/team/${metaData.teamIdentifier}/members/remove/`;

  return apiFetch2({
    config,
    path,
    request: {
      method: "POST",
      body: JSON.stringify({ user: metaData.user }),
    },
  });
}
