import { DapperInterface } from "@thunderstore/dapper";

import {
  getFakeCommunities,
  getFakeCommunity,
  getFakeCommunityFilters,
} from "./fakers/community";
import { getFakeChangelog, getFakeReadme } from "./fakers/markup";
import {
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
  public getPackageChangelog = getFakeChangelog;
  public getPackageListingDetails = getFakePackageListingDetails;
  public getPackageListings = getFakePackageListings;
  public getPackageReadme = getFakeReadme;
  public getTeamDetails = getFakeTeamDetails;
  public getTeamMembers = getFakeTeamMembers;
  public getTeamServiceAccounts = getFakeServiceAccounts;
}
