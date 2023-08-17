import { Dapper } from "../dapper";
import { ServiceAccount } from "@thunderstore/dapper/src/schema";
import {
  getListOfIds,
  getServiceAccountDummyData,
} from "@thunderstore/dapper/src/implementations/dummy/generate";

// Dapper method type, defining the parameters required to fetch the data.
export type GetServiceAccountList = (
  teamId: string
) => Promise<ServiceAccount[]>;

// Method implementation for Dapper class.
export const getServiceAccountList: GetServiceAccountList = async function (
  this: Dapper,
  teamId: string
) {
  // TODO: CHANGE THIS TO USE THE ACTUAL THUNDERSTORE API, ONCE THE API ENDPOINTS HAS BEEN IMPLEMENTED
  return getListOfIds(5).map((x) => {
    return getServiceAccountDummyData(teamId + x);
  });
};
