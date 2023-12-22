import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";

export async function fetchTeamMembers(
  config: RequestConfig,
  teamName: string
) {
  const path = `api/cyberstorm/team/${teamName}/member/`;

  return await apiFetch(config, path);
}
