import { Dapper } from "../dapper";
import { Package } from "../schema";
import { getPackageDummyData } from "../implementations/dummy/generate";

// Dapper method type, defining the parameters required to fetch the data.
export type GetPackage = (
  community: string,
  namespace: string,
  name: string
) => Package;

// Method implementation for Dapper class.
export const getPackage: GetPackage = function (
  this: Dapper,
  community: string,
  namespace: string,
  name: string
) {
  // TODO: CHANGE THIS TO USE THE ACTUAL THUNDERSTORE API, ONCE THE API ENDPOINTS HAS BEEN IMPLEMENTED
  return getPackageDummyData("1337", community, namespace, name);
};
