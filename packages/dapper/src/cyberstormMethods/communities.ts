import { Community } from "../cyberstormSchemas/community";
import { Dapper } from "../dapper";
import {
  getCommunityPreviewDummyData,
  getListOfIds,
} from "../implementations/dummy/generate";

// Dapper method type, defining the parameters required to fetch the data.
export type GetCommunities = () => Promise<Community[]>;

// Method implementation for Dapper class.
export const getCommunities: GetCommunities = async function (this: Dapper) {
  /*
  return this.queryAndProcess(
    "api/cyberstorm/community/",
    [],
    schema,
    transform
  );
  */

  return getListOfIds(20).map((communityId) => {
    return getCommunityPreviewDummyData(communityId);
  });
};
