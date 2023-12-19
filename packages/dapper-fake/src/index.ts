import { DapperInterface } from "@thunderstore/dapper";

import {
  getFakeCommunities,
  getFakeCommunity,
  getFakeCommunityFilters,
} from "./fakers/community";
import {
  getFakeDependencies,
  getFakePackageListingDetails,
  getFakePackageListings,
} from "./fakers/package";
import { getFakeServiceAccounts } from "./fakers/serviceAccount";
import { getFakeTeamDetails, getFakeTeamMembers } from "./fakers/team";
import { getFakeCurrentUser } from "./fakers/user";

export class DapperFake implements DapperInterface {
  public getCommunities = getFakeCommunities;
  public getCommunity = getFakeCommunity;
  public getCommunityFilters = getFakeCommunityFilters;
  public getCurrentUser = getFakeCurrentUser;
  public getPackageDependencies = getFakeDependencies;
  public getPackageListingDetails = getFakePackageListingDetails;
  public getPackageListings = getFakePackageListings;
  public getTeamDetails = getFakeTeamDetails;
  public getTeamMembers = getFakeTeamMembers;
  public getTeamServiceAccounts = getFakeServiceAccounts;
}
