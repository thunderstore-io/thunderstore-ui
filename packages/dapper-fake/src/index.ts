import { DapperInterface } from "@thunderstore/dapper";

import {
  getFakeCommunities,
  getFakeCommunity,
  getFakeCommunityFilters,
} from "./fakers/community";
import {
  getFakeChangelog,
  getFakeDynamicHTML,
  getFakeReadme,
} from "./fakers/markup";
import {
  getFakePackageListingDetails,
  getFakePackageListingStatus,
  getFakePackageListings,
  getFakePackagePermissions,
  getFakePackageSource,
  getFakePackageVersionDependencies,
  getFakePackageVersionDetails,
  getFakePackageVersions,
  getFakePackageWiki,
  getFakePackageWikiPage,
  getFakeRatedPackages,
} from "./fakers/package";
import { getFakeServiceAccounts } from "./fakers/serviceAccount";
import { postFakePackageSubmissionMetadata } from "./fakers/submission";
import { getFakePackageSubmissionStatus } from "./fakers/submission";
import {
  getFakeTeamDetails,
  getFakeTeamMembers,
  postFakeTeamCreate,
} from "./fakers/team";
import {
  getFakeCurrentUser,
  getFakeCurrentUserTeamPermissions,
} from "./fakers/user";

export class DapperFake implements DapperInterface {
  public getCommunities = getFakeCommunities;
  public getCommunity = getFakeCommunity;
  public getCommunityFilters = getFakeCommunityFilters;
  public getCurrentUser = getFakeCurrentUser;
  public getCurrentUserTeamPermissions = getFakeCurrentUserTeamPermissions;
  public getDynamicHTML = getFakeDynamicHTML;
  public getPackageChangelog = getFakeChangelog;
  public getPackagePermissions = getFakePackagePermissions;
  public getPackageListingDetails = getFakePackageListingDetails;
  public getPackageListingStatus = getFakePackageListingStatus;
  public getPackageListings = getFakePackageListings;
  public getPackageReadme = getFakeReadme;
  public getPackageVersionDetails = getFakePackageVersionDetails;
  public getPackageVersions = getFakePackageVersions;
  public getPackageSource = getFakePackageSource;
  public getPackageVersionDependencies = getFakePackageVersionDependencies;
  public getPackageWiki = getFakePackageWiki;
  public getPackageWikiPage = getFakePackageWikiPage;
  public getPrivateTeamDetails = getFakeTeamDetails;
  public getRatedPackages = getFakeRatedPackages;
  public getTeamDetails = getFakeTeamDetails;
  public getTeamMembers = getFakeTeamMembers;
  public getTeamServiceAccounts = getFakeServiceAccounts;
  public postPackageSubmissionMetadata = postFakePackageSubmissionMetadata;
  public getPackageSubmissionStatus = getFakePackageSubmissionStatus;
  public postTeamCreate = postFakeTeamCreate;
}
