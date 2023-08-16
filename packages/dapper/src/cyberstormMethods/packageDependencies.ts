import { z } from "zod";

import { Dapper } from "../dapper";
import { PackageDependency } from "@thunderstore/dapper/src/schema";
import { getPackageDependencyDummyData } from "@thunderstore/dapper/src/implementations/dummy/generate";
import { packageDependencySchema } from "../cyberstormSchemas/package";

// Dapper method type, defining the parameters required to fetch the data.
export type GetPackageDependencies = (
  community: string,
  namespace: string
) => Promise<PackageDependency[]>;

// Method for transforming the received data to a format that will be
// passed on.
const transform = (
  data: z.infer<typeof packageDependencySchema[]>
): PackageDependency[] => ({
  ...data,
});

// Method implementation for Dapper class.
export const getPackageDependencies: GetPackageDependencies = async function (
  this: Dapper,
  community: string,
  namespace: string
) {
  // TODO: CHANGE THIS TO USE THE ACTUAL THUNDERSTORE API, ONCE THE API ENDPOINTS HAS BEEN IMPLEMENTED
  const dummyPackageDependency = [
    getPackageDependencyDummyData("1", community, namespace),
    getPackageDependencyDummyData("2", community, namespace),
    getPackageDependencyDummyData("3", community, namespace),
  ];

  return transform(dummyPackageDependency);
};
