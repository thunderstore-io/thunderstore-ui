import { Dapper } from "../dapper";
import { PackageDependency } from "../schema";
import { getPackageDependencyDummyData } from "../implementations/dummy/generate";

// Dapper method type, defining the parameters required to fetch the data.
export type GetPackageDependencies = (
  community: string,
  namespace: string
) => Promise<PackageDependency[]>;

// Method implementation for Dapper class.
export const getPackageDependencies: GetPackageDependencies = async function (
  this: Dapper,
  community: string,
  namespace: string
) {
  // TODO: CHANGE THIS TO USE THE ACTUAL THUNDERSTORE API, ONCE THE API ENDPOINTS HAS BEEN IMPLEMENTED
  return [
    getPackageDependencyDummyData("1", community, namespace),
    getPackageDependencyDummyData("2", community, namespace),
    getPackageDependencyDummyData("3", community, namespace),
  ];
};
