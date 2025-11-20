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
  getFakePackagePermissions,
  getFakePackageVersionDependencies,
  getFakePackageVersions,
  getFakePackageSource,
  getFakePackageVersionDetails,
} from "./fakers/package";
import { getFakeServiceAccounts } from "./fakers/serviceAccount";
import {
  getFakeTeamDetails,
  getFakeTeamMembers,
  postFakeTeamCreate,
} from "./fakers/team";
import {
  getFakeCurrentUser,
  getFakeCurrentUserTeamPermissions,
} from "./fakers/user";
import { postFakePackageSubmissionMetadata } from "./fakers/submission";
import { getFakePackageSubmissionStatus } from "./fakers/submission";

export class DapperFake implements DapperInterface {
  public getCommunities = getFakeCommunities;
  public getCommunity = getFakeCommunity;
  public getCommunityFilters = getFakeCommunityFilters;
  public getCurrentUser = getFakeCurrentUser;
  public getCurrentUserTeamPermissions = getFakeCurrentUserTeamPermissions;
  public getPackageChangelog = getFakeChangelog;
  public getPackagePermissions = getFakePackagePermissions;
  public getPackageListingDetails = getFakePackageListingDetails;
  public getPackageListings = getFakePackageListings;
  public getPackageReadme = getFakeReadme;
  public getPackageVersionDetails = getFakePackageVersionDetails;
  public getPackageVersions = getFakePackageVersions;
  public getPackageSource = getFakePackageSource;
  public getPackageVersionDependencies = getFakePackageVersionDependencies;
  public getTeamDetails = getFakeTeamDetails;
  public getTeamMembers = getFakeTeamMembers;
  public getTeamServiceAccounts = getFakeServiceAccounts;
  public postPackageSubmissionMetadata = postFakePackageSubmissionMetadata;
  public getPackageSubmissionStatus = getFakePackageSubmissionStatus;
  public postTeamCreate = postFakeTeamCreate;
}
