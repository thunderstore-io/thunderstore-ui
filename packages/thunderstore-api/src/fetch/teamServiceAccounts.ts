import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";

export async function fetchTeamServiceAccounts(
  config: RequestConfig,
  teamName: string
) {
  const path = `api/cyberstorm/team/${teamName}/service-accounts/`;

  return await apiFetch(config, path);
}
