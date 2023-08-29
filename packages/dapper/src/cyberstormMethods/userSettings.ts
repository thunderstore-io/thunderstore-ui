import { getUserSettingsDummyData } from "../implementations/dummy/generate";
import { Dapper } from "../dapper";
import { UserSettings } from "../schema";

// Dapper method type, defining the parameters required to fetch the data.
export type GetUserSettings = (userId: string) => Promise<UserSettings>;

// Method implementation for Dapper class.
export const getUserSettings: GetUserSettings = async function (
  this: Dapper,
  userId
) {
  // TODO: CHANGE THIS TO USE THE ACTUAL THUNDERSTORE API, ONCE THE API ENDPOINTS HAS BEEN IMPLEMENTED
  return getUserSettingsDummyData(userId);
};
