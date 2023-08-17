import { Dapper } from "../dapper";
import { Team } from "@thunderstore/dapper/src/schema";
import {
  getListOfIds,
  getTeamDummyData,
} from "@thunderstore/dapper/src/implementations/dummy/generate";

// Dapper method type, defining the parameters required to fetch the data.
export type GetTeamList = () => Promise<Team[]>;

// Method implementation for Dapper class.
export const getTeamList: GetTeamList = async function (this: Dapper) {
  // TODO: CHANGE THIS TO USE THE ACTUAL THUNDERSTORE API, ONCE THE API ENDPOINTS HAS BEEN IMPLEMENTED
  return getListOfIds(5).map((x) => {
    return getTeamDummyData(x);
  });
};
