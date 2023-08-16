import { DapperInterface } from "../../dapper";
import {
  getCommunityDummyData,
  getCommunityPreviewDummyData,
  getListOfIds,
} from "./generate";
import { getPackageListings } from "../../cyberstormMethods/packageListings";
import { getPackage } from "../../cyberstormMethods/package";
import { getTeam } from "../../cyberstormMethods/team";
import { getUser } from "../../cyberstormMethods/user";

const NotImplemented = () => {
  throw new Error("Not implemented");
};

export class DummyDapper implements DapperInterface {
  public getPackageListings = getPackageListings;

  public getCommunities = async () => {
    return getListOfIds(20).map((communityId) => {
      return getCommunityPreviewDummyData(communityId);
    });
  };

  public getCommunity = async (communityId: string) => {
    return {
      community: getCommunityDummyData(communityId),
      servers: [],
    };
  };

  public getPackage = getPackage;

  public getTeam = getTeam;

  public getUser = getUser;

  public getFrontpage = NotImplemented;
  public getOldPackage = NotImplemented;
  public getOldCommunityPackageListing = NotImplemented;
}
