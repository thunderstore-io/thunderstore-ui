import * as methods from "./types/methods";

export interface DapperInterface {
  getCommunities: methods.GetCommunities;
  getCommunity: methods.GetCommunity;
  getCommunityFilters: methods.GetCommunityFilters;
  getCurrentUser: methods.GetCurrentUser;
  getCurrentUserTeamPermissions: methods.GetCurrentUserTeamPermissions;
  getDynamicHTML: methods.GetDynamicHTML;
  getPackageChangelog: methods.GetPackageChangelog;
  getPackageListingDetails: methods.GetPackageListingDetails;
  getPackageListingStatus: methods.GetPackageListingStatus;
  getPackageListings: methods.GetPackageListings;
  getPackageReadme: methods.GetPackageReadme;
  getPackagePermissions: methods.GetPackagePermissions;
  getPackageSource: methods.GetPackageSource;
  getPackageSubmissionStatus: methods.GetPackageSubmissionStatus;
  getPackageVersions: methods.GetPackageVersions;
  getPackageVersionDependencies: methods.GetPackageVersionDependencies;
  getPackageVersionDetails: methods.GetPackageVersionDetails;
  getPackageWiki: methods.GetPackageWiki;
  getPackageWikiPage: methods.GetPackageWikiPage;
  getPrivateTeamDetails: methods.GetPrivateTeamDetails;
  getRatedPackages: methods.GetRatedPackages;
  getTeamDetails: methods.GetTeamDetails;
  getTeamMembers: methods.GetTeamMembers;
  getTeamServiceAccounts: methods.GetTeamServiceAccounts;
  postPackageSubmissionMetadata: methods.PostPackageSubmissionMetadata;
  postTeamCreate: methods.PostTeamCreate;
}
