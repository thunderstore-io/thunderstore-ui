import { Dapper } from "../dapper";
import { ServiceAccount } from "../schema";
import { getServiceAccountDummyData } from "../implementations/dummy/generate";

// Dapper method type, defining the parameters required to fetch the data.
export type GetServiceAccount = (
  serviceAccountId: string
) => Promise<ServiceAccount>;

// Method implementation for Dapper class.
export const getServiceAccount: GetServiceAccount = async function (
  this: Dapper,
  serviceAccountId: string
) {
  // TODO: CHANGE THIS TO USE THE ACTUAL THUNDERSTORE API, ONCE THE API ENDPOINTS HAS BEEN IMPLEMENTED
  return getServiceAccountDummyData(serviceAccountId);
};
