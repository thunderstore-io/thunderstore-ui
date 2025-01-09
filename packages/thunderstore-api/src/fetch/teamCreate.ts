import { RequestConfig } from "../index";
import { apiFetch2 } from "../apiFetch";

export type CreateTeamApiArgs = {
  name: string;
};

export function createTeam(config: RequestConfig, data: CreateTeamApiArgs) {
  // TODO: The endpoint doesn't exist, and once it does this won't be
  // the URL it's served from.
  const path = "api/cyberstorm/teams/create/";

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
