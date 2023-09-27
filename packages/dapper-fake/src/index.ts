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
import {
  getFakeCurrentUser,
  getFakeUser,
  getFakeUserSettings,
} from "./fakers/user";

export class DapperFake implements DapperInterface {
  public getCommunities = getFakeCommunities;
  public getCommunity = getFakeCommunity;
  public getCurrentUser = getFakeCurrentUser;
  public getPackage = getFakePackage;
  public getPackageDependencies = getFakeDependencies;
  public getPackageListings = getFakePackageListings;
  public getServiceAccount = getFakeServiceAccount;
  public getServiceAccountList = getFakeServiceAccounts;
  public getTeam = getFakeTeam;
  public getTeamList = getFakeTeams;
  public getUser = getFakeUser;
  public getUserSettings = getFakeUserSettings;
}
