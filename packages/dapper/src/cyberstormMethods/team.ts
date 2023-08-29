import { Dapper } from "../dapper";
import { Team } from "../schema";
import { getTeamDummyData } from "../implementations/dummy/generate";

// Dapper method type, defining the parameters required to fetch the data.
export type GetTeam = (teamId: string) => Promise<Team>;

// Method implementation for Dapper class.
export const getTeam: GetTeam = async function (this: Dapper, teamId: string) {
  // TODO: CHANGE THIS TO USE THE ACTUAL THUNDERSTORE API, ONCE THE API ENDPOINTS HAS BEEN IMPLEMENTED
  return getTeamDummyData(teamId);
};
