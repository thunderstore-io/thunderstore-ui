import { z } from "zod";

import { communitySchema } from "../cyberstormSchemas/community";
import { Dapper } from "../dapper";
import {
  Community,
  getCommunityDummyData,
  getListOfIds,
  getServerPreviewDummyData,
  ServerPreview,
} from "@thunderstore/cyberstorm";
import { serverPreviewSchema } from "../cyberstormSchemas/server";

// Schema describing the data received from backend, used to validate the data.
const schema = z.object({
  community: communitySchema,
  servers: z.array(serverPreviewSchema),
});

// Define values returned by the Dapper method.
interface CommunityData {
  community: Community;
  servers: ServerPreview[];
}

// Dapper method type, defining the parameters required to fetch the data.
export type GetCommunity = (identifier: string) => CommunityData;

// Method for transforming the received data to a format that will be
// passed on.
const transform = (viewData: z.infer<typeof schema>): CommunityData => ({
  community: viewData.community,
  servers: viewData.servers,
});

// Method implementation for Dapper class.
export const getCommunity: GetCommunity = function (this: Dapper, identifier) {
  // TODO: CHANGE THIS TO USE THE ACTUAL THUNDERSTORE API, ONCE THE API ENDPOINTS HAS BEEN IMPLEMENTED
  const dummyCommunity = getCommunityDummyData(identifier);
  const dummyServers = getListOfIds(20).map((packageId) => {
    return getServerPreviewDummyData(packageId);
  });

  return transform({ community: dummyCommunity, servers: dummyServers });
};
