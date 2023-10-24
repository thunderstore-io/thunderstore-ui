import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";

export async function fetchTeamDetails(
  config: RequestConfig,
  teamName: string
) {
  const path = `api/cyberstorm/team/${teamName}/`;

  return await apiFetch(config, path);
}
