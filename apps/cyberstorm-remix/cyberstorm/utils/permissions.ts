import { getSessionTools } from "cyberstorm/security/publicEnvVariables";

import type { CurrentUser } from "@thunderstore/dapper/types";

export const isTeamOwner = (
  teamName: string,
  currentUser: CurrentUser | undefined
) =>
  currentUser?.teams_full?.find((t) => t.name === teamName)?.role === "owner";

export async function assertTeamAccess(teamName: string) {
  const tools = getSessionTools();
  const currentUser = await tools?.getSessionCurrentUser(true);

  if (!currentUser?.username) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const hasTeamAccess = (currentUser.teams_full ?? []).some(
    (team) => team.name === teamName
  );

  if (!hasTeamAccess) {
    throw new Response("Forbidden", { status: 403 });
  }
}
