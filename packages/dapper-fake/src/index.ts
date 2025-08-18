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
  getFakePackageVersions,
} from "./fakers/package";
import { getFakeServiceAccounts } from "./fakers/serviceAccount";
import {
  getFakeTeamDetails,
  getFakeTeamMembers,
  postFakeTeamCreate,
} from "./fakers/team";
import { getFakeCurrentUser } from "./fakers/user";
import { postFakePackageSubmissionMetadata } from "./fakers/submission";
import { getFakePackageSubmissionStatus } from "./fakers/submission";

export class DapperFake implements DapperInterface {
  public getCommunities = getFakeCommunities;
  public getCommunity = getFakeCommunity;
  public getCommunityFilters = getFakeCommunityFilters;
  public getCurrentUser = getFakeCurrentUser;
  public getPackageChangelog = getFakeChangelog;
  public getPackageListingDetails = getFakePackageListingDetails;
  public getPackageListings = getFakePackageListings;
  public getPackageReadme = getFakeReadme;
  public getPackageVersions = getFakePackageVersions;
  public getTeamDetails = getFakeTeamDetails;
  public getTeamMembers = getFakeTeamMembers;
  public getTeamServiceAccounts = getFakeServiceAccounts;
  public postPackageSubmissionMetadata = postFakePackageSubmissionMetadata;
  public getPackageSubmissionStatus = getFakePackageSubmissionStatus;
  public postTeamCreate = postFakeTeamCreate;
}
