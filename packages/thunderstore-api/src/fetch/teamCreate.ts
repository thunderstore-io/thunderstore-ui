import { RequestConfig } from "../index";
import { apiFetch2 } from "../apiFetch";

export type CreateTeamApiArgs = {
  name: string;
};

export function createTeam(config: RequestConfig, data: CreateTeamApiArgs) {
  const path = "api/cyberstorm/teams/create/";

  return apiFetch2({
    config,
    path,
    method: "POST",
    body: JSON.stringify(data),
  });
}
