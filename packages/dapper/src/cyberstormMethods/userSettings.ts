import { z } from "zod";

import { getUserSettingsDummyData } from "@thunderstore/dapper/src/implementations/dummy/generate";
import { userSettingsSchema } from "../cyberstormSchemas/user";
import { Dapper } from "..";
import { UserSettings } from "../schema";

// Dapper method type, defining the parameters required to fetch the data.
export type GetUserSettings = (userId: string) => Promise<UserSettings>;

// Method for transforming the received data to a format that will be
// passed on.
const transform = (data: z.infer<typeof userSettingsSchema>) => ({
  ...data,
});

// Method implementation for Dapper class.
export const getUserSettings: GetUserSettings = async function (
  this: Dapper,
  userId
) {
  // TODO: CHANGE THIS TO USE THE ACTUAL THUNDERSTORE API, ONCE THE API ENDPOINTS HAS BEEN IMPLEMENTED
  const dummyUserSettings = getUserSettingsDummyData(userId);

  return transform(dummyUserSettings);
};
