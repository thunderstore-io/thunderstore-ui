import { DapperInterface } from "@thunderstore/dapper";

import { getFakeCommunities, getFakeCommunity } from "./fakers/community";
import {
  getFakeDependencies,
  getFakePackage,
  getFakePackageListings,
} from "./fakers/package";
import { getFakeServiceAccounts } from "./fakers/serviceAccount";
import { getFakeTeamDetails, getFakeTeamMembers } from "./fakers/team";
import { getFakeCurrentUser } from "./fakers/user";

export class DapperFake implements DapperInterface {
  public getCommunities = getFakeCommunities;
  public getCommunity = getFakeCommunity;
  public getCurrentUser = getFakeCurrentUser;
  public getPackage = getFakePackage;
  public getPackageDependencies = getFakeDependencies;
  public getPackageListings = getFakePackageListings;
  public getTeamDetails = getFakeTeamDetails;
  public getTeamMembers = getFakeTeamMembers;
  public getTeamServiceAccounts = getFakeServiceAccounts;
}
