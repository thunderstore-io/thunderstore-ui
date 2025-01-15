import { RequestConfig } from "../index";
import { apiFetch2 } from "../apiFetch";

export type teamDisbandTeamMetaArgs = {
  teamIdentifier: string;
};

export interface teamDisbandTeamApiArgs {
  verification: string;
}

export function teamDisbandTeam(
  config: RequestConfig,
  data: teamDisbandTeamApiArgs,
  meta: teamDisbandTeamMetaArgs
) {
  const path = `/api/cyberstorm/team/${meta.teamIdentifier}/disband/`;

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
