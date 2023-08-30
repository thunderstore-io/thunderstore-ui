import { DapperInterface } from "@thunderstore/dapper";

import { getFakeCommunities, getFakeCommunity } from "./fakers/community";
import {
  getFakeDependencies,
  getFakePackage,
  getFakePackageListings,
} from "./fakers/package";
import {
  getFakeServiceAccount,
  getFakeServiceAccounts,
} from "./fakers/serviceAccount";
import { getFakeTeam, getFakeTeams } from "./fakers/team";
import { getFakeUser, getFakeUserSettings } from "./fakers/user";

const NotImplemented = () => {
  throw new Error("DapperFake has not implemented a provider method");
};

export class DapperFake implements DapperInterface {
  public getCommunities = getFakeCommunities;
  public getCommunity = getFakeCommunity;
  public getPackage = getFakePackage;
  public getPackageDependencies = getFakeDependencies;
  public getPackageListings = getFakePackageListings;
  public getServiceAccount = getFakeServiceAccount;
  public getServiceAccountList = getFakeServiceAccounts;
  public getTeam = getFakeTeam;
  public getTeamList = getFakeTeams;
  public getUser = getFakeUser;
  public getUserSettings = getFakeUserSettings;

  // Legacy for backwards compatibility. Can be removed once support for
  // @thunderstore/nextjs app and @thunderstore/components package are
  // dropped.
  public getFrontpage = NotImplemented;
  public getOldPackage = NotImplemented;
  public getOldCommunityPackageListing = NotImplemented;
}
