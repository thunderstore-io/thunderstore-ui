import { z } from "zod";

import { communityPreviewSchema } from "../cyberstormSchemas/community";
import { Dapper } from "../dapper";
import {
  Community,
  getCommunityPreviewDummyData,
  getListOfIds,
} from "@thunderstore/cyberstorm";

// Schema describing the data received from backend, used to validate the data.
const schema = z.array(communityPreviewSchema);

// Dapper method type, defining the parameters required to fetch the data.
export type GetCommunities = () => Community[];

// Method for transforming the received data to a format that will be
// passed on.
const transform = (viewData: z.infer<typeof schema>): Community[] => viewData;

// Method implementation for Dapper class.
export const getCommunities: GetCommunities = function (this: Dapper) {
  // TODO: CHANGE THIS TO USE THE ACTUAL THUNDERSTORE API, ONCE THE API ENDPOINTS HAS BEEN IMPLEMENTED
  const dummyCommunities = getListOfIds(20).map((communityId) => {
    return getCommunityPreviewDummyData(communityId);
  });

  return transform(dummyCommunities);
};
