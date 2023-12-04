import { RequestConfig } from "../index";
import { apiFetch2 } from "../apiFetch";

export type teamDisbandTeamMetaData = {
  teamIdentifier: string;
};

export interface teamDisbandTeamApiArgs {
  verification: string;
}

export function teamDisbandTeam(
  config: RequestConfig,
  data: teamDisbandTeamApiArgs,
  metaData: teamDisbandTeamMetaData
) {
  const path = `/api/cyberstorm/team/${metaData.teamIdentifier}/disband/`;

  return apiFetch2({
    config,
    path,
    request: {
      method: "POST",
      body: JSON.stringify(data),
    },
  });
}
