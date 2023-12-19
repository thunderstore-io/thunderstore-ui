import * as methods from "./types/methods";

export interface DapperInterface {
  getCommunities: methods.GetCommunities;
  getCommunity: methods.GetCommunity;
  getCommunityFilters: methods.GetCommunityFilters;
  getCurrentUser: methods.GetCurrentUser;
  getPackageChangelog: methods.GetPackageChangelog;
  getPackageListingDetails: methods.GetPackageListingDetails;
  getPackageListings: methods.GetPackageListings;
  getPackageReadme: methods.GetPackageReadme;
  getTeamDetails: methods.GetTeamDetails;
  getTeamMembers: methods.GetTeamMembers;
  getTeamServiceAccounts: methods.GetTeamServiceAccounts;
}
