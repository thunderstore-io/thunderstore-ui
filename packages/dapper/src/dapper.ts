import * as methods from "./types/methods";

export interface DapperInterface {
  getCommunities: methods.GetCommunities;
  getCommunity: methods.GetCommunity;
  getCommunityFilters: methods.GetCommunityFilters;
  getCurrentUser: methods.GetCurrentUser;
  getCurrentUserTeamPermissions: methods.GetCurrentUserTeamPermissions;
  getPackageChangelog: methods.GetPackageChangelog;
  getPackageListingDetails: methods.GetPackageListingDetails;
  getPackageListings: methods.GetPackageListings;
  getPackageReadme: methods.GetPackageReadme;
  getPackageVersions: methods.GetPackageVersions;
  getPackageVersionDependencies: methods.GetPackageVersionDependencies;
  getPackagePermissions: methods.GetPackagePermissions;
  getPackageSource: methods.GetPackageSource;
  getTeamDetails: methods.GetTeamDetails;
  getTeamMembers: methods.GetTeamMembers;
  getTeamServiceAccounts: methods.GetTeamServiceAccounts;
  postTeamCreate: methods.PostTeamCreate;
  postPackageSubmissionMetadata: methods.PostPackageSubmissionMetadata;
  getPackageSubmissionStatus: methods.GetPackageSubmissionStatus;
}
