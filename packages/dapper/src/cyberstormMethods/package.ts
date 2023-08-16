import { z } from "zod";

import { Dapper } from "../dapper";
import { Package } from "@thunderstore/dapper/src/schema";
import { getPackageDummyData } from "@thunderstore/dapper/src/implementations/dummy/generate";
import { packageSchema } from "../cyberstormSchemas/package";

// Dapper method type, defining the parameters required to fetch the data.
export type GetPackage = (
  community: string,
  namespace: string,
  name: string
) => Package;

// Method for transforming the received data to a format that will be
// passed on.
const transform = (viewData: z.infer<typeof packageSchema>): Package => ({
  ...viewData,
});

// Method implementation for Dapper class.
export const getPackage: GetPackage = function (
  this: Dapper,
  community: string,
  namespace: string,
  name: string
) {
  // TODO: CHANGE THIS TO USE THE ACTUAL THUNDERSTORE API, ONCE THE API ENDPOINTS HAS BEEN IMPLEMENTED
  const dummyPackage = getPackageDummyData("1337", community, namespace, name);

  return transform(dummyPackage);
};
