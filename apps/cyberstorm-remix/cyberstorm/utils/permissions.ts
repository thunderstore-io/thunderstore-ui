import type { CurrentUser } from "@thunderstore/dapper";

export const isTeamOwner = (
  teamName: string,
  currentUser: CurrentUser | undefined
) =>
  currentUser?.teams_full?.find((t) => t.name === teamName)?.role === "owner";
