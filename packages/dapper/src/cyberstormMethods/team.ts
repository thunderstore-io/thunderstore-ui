import { z } from "zod";

import { Dapper } from "../dapper";
import { Team } from "@thunderstore/dapper/src/schema";
import {
  getListOfIds,
  getTeamDummyData,
} from "@thunderstore/dapper/src/implementations/dummy/generate";
import { teamSchema } from "../cyberstormSchemas/team";

// Schema describing the data received from backend, used to validate the data.
const schema = z.array(teamSchema);

// Dapper method type, defining the parameters required to fetch the data.
export type GetTeam = () => Team[];

// Method for transforming the received data to a format that will be
// passed on.
const transform = (viewData: z.infer<typeof schema>): Team[] => viewData;

// Method implementation for Dapper class.
export const getTeam: GetTeam = function (this: Dapper) {
  // TODO: CHANGE THIS TO USE THE ACTUAL THUNDERSTORE API, ONCE THE API ENDPOINTS HAS BEEN IMPLEMENTED
  const dummyUserAccessibleTeams = getListOfIds(5).map((x) => {
    return getTeamDummyData(x);
  });

  return transform(dummyUserAccessibleTeams);
};
