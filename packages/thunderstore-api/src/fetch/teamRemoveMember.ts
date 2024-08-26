import { RequestConfig } from "../index";
import { apiFetch2 } from "../apiFetch";

export type teamRemoveMemberMetaArgs = {
  teamIdentifier: string;
  username: string;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface teamRemoveMemberApiArgs {}

export function teamRemoveMember(
  config: RequestConfig,
  _data: teamRemoveMemberApiArgs,
  meta: teamRemoveMemberMetaArgs
) {
  const path = `/api/cyberstorm/team/${meta.teamIdentifier}/members/remove/`;

  return apiFetch2({
    config,
    path,
    request: {
      method: "POST",
      body: JSON.stringify({ username: meta.username }),
    },
  });
}
