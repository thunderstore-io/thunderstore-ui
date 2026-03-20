import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { redirectToLogin } from "cyberstorm/utils/ThunderstoreAuth";

import type { CurrentUser } from "@thunderstore/dapper/types";

export const isTeamOwner = (
  teamName: string,
  currentUser: CurrentUser | undefined
) =>
  currentUser?.teams_full?.find((t) => t.name === teamName)?.role === "owner";

export async function assertTeamAccess(
  teamName: string,
  requestPathname?: string
) {
  const tools = getSessionTools();
  const currentUser = await tools?.getSessionCurrentUser(true);

  if (!currentUser?.username) {
    throw redirectToLogin(requestPathname);
  }

  const hasTeamAccess = (currentUser.teams_full ?? []).some(
    (team) => team.name === teamName
  );

  if (!hasTeamAccess) {
    throw new Response("Forbidden", { status: 403 });
  }
}
