import {
  getListOfIds,
  getPackagePreviewDummyData,
  getServerPreviewDummyData,
  getUserDummyData,
} from "../implementations/dummy/generate";
import { PackagePreview, ServerPreview, User } from "../schema";
import { Dapper } from "../dapper";

// Define values returned by the Dapper method.
export interface UserData {
  user: User;
  packages: PackagePreview[];
  servers: ServerPreview[];
}

// Dapper method type, defining the parameters required to fetch the data.
export type GetUser = (userId: string) => Promise<UserData>;

// Method implementation for Dapper class.
export const getUser: GetUser = async function (this: Dapper, userId) {
  // TODO: CHANGE THIS TO USE THE ACTUAL THUNDERSTORE API, ONCE THE API ENDPOINTS HAS BEEN IMPLEMENTED
  const dummyUserData = getUserDummyData(userId);
  const dummyPackagesPreviews = getListOfIds(20).map((x) => {
    return getPackagePreviewDummyData(x);
  });
  const dummyServers = getListOfIds(20).map((x) => {
    return getServerPreviewDummyData(x);
  });

  return {
    user: dummyUserData,
    packages: dummyPackagesPreviews,
    servers: dummyServers,
  };
};
