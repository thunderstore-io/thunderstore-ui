import { DapperInterface } from "../../dapper";
import {
  getCommunityDummyData,
  getCommunityPreviewDummyData,
  getListOfIds,
  getPackageDependencyDummyData,
  getServiceAccountDummyData,
  getTeamDummyData,
  getUserDummyData,
  getUserSettingsDummyData,
} from "./generate";
import { getPackageListings } from "../../cyberstormMethods/packageListings";
import { getPackage } from "../../cyberstormMethods/package";

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

  public getServiceAccount = async (serviceAccountId: string) => {
    return getServiceAccountDummyData(serviceAccountId);
  };

  public getServiceAccountList = async (teamId: string) => {
    return getListOfIds(5).map((x) => {
      return getServiceAccountDummyData(teamId + x);
    });
  };

  public getPackage = getPackage;

  public getTeam = async (teamId: string) => {
    return getTeamDummyData(teamId);
  };

  public getTeamList = async () => {
    return getListOfIds(5).map((x) => {
      return getTeamDummyData(x);
    });
  };

  public getUser = async (userId: string) => {
    return {
      user: getUserDummyData(userId),
      packages: [],
      servers: [],
    };
  };

  public getUserSettings = async (userId: string) => {
    return getUserSettingsDummyData(userId);
  };

  public getPackageDependencies = async (
    community: string,
    namespace: string
  ) => {
    return [
      getPackageDependencyDummyData("1", community, namespace),
      getPackageDependencyDummyData("2", community, namespace),
      getPackageDependencyDummyData("3", community, namespace),
    ];
  };

  public getFrontpage = NotImplemented;
  public getOldPackage = NotImplemented;
  public getOldCommunityPackageListing = NotImplemented;
}
