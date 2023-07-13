import { z } from "zod";

import {
  getListOfIds,
  getPackagePreviewDummyData,
  getServerPreviewDummyData,
  getUserDummyData,
} from "@thunderstore/dapper/src/implementations/dummy/generate";
import {
  PackagePreview,
  ServerPreview,
  User,
} from "@thunderstore/dapper/src/schema";
import { userSchema } from "../cyberstormSchemas/user";
import { packagePreviewSchema } from "../cyberstormSchemas/package";
import { serverPreviewSchema } from "../cyberstormSchemas/server";
import { Dapper } from "..";

// Schema describing the data received from backend, used to validate the data.
const schema = z.object({
  user: userSchema,
  packages: z.array(packagePreviewSchema),
  servers: z.array(serverPreviewSchema),
});

// Define values returned by the Dapper method.
interface UserData {
  user: User;
  packages: PackagePreview[];
  servers: ServerPreview[];
}

// Dapper method type, defining the parameters required to fetch the data.
export type GetUser = (userId: string) => UserData;

// Method for transforming the received data to a format that will be
// passed on.
const transform = (data: z.infer<typeof schema>): UserData => ({
  user: data.user,
  packages: data.packages,
  servers: data.servers,
});

// Method implementation for Dapper class.
export const getUser: GetUser = function (this: Dapper, userId) {
  // TODO: CHANGE THIS TO USE THE ACTUAL THUNDERSTORE API, ONCE THE API ENDPOINTS HAS BEEN IMPLEMENTED
  const dummyUserData = getUserDummyData(userId);
  const dummyPackagesPreviews = getListOfIds(20).map((x) => {
    return getPackagePreviewDummyData(x);
  });
  const dummyServers = getListOfIds(20).map((x) => {
    return getServerPreviewDummyData(x);
  });

  return transform({
    user: dummyUserData,
    packages: dummyPackagesPreviews,
    servers: dummyServers,
  });
};
