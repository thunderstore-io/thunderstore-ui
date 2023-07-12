import { z } from "zod";

import {
  Community,
  communityListSchema,
  PaginatedList,
} from "../cyberstormSchemas/community";
import { Dapper } from "../dapper";

// Schema describing the data received from backend, used to validate the data.
const schema = communityListSchema;

// Dapper method type, defining the parameters required to fetch the data.
export type GetCommunities = () => Promise<PaginatedList<Community>>;

// Method for transforming the received data to a format that will be
// passed on.
const transform = (
  viewData: z.infer<typeof schema>
): PaginatedList<Community> => viewData;

// Method implementation for Dapper class.
export const getCommunities: GetCommunities = function (this: Dapper) {
  return this.queryAndProcess(
    "api/cyberstorm/community/",
    [],
    schema,
    transform
  );

  // const dummyCommunities = getListOfIds(20).map((communityId) => {
  //   return getCommunityPreviewDummyData(communityId);
  // });
  //
  // return transform(dummyCommunities);
};
