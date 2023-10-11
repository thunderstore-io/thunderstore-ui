import * as methods from "./types/methods";

export interface DapperInterface {
  getCommunities: methods.GetCommunities;
  getCommunity: methods.GetCommunity;
  getCurrentUser: methods.GetCurrentUser;
  getPackage: methods.GetPackage;
  getPackageDependencies: methods.GetPackageDependencies;
  getPackageListings: methods.GetPackageListings;
  getTeamDetails: methods.GetTeamDetails;
  getTeamMembers: methods.GetTeamMembers;
  getTeamServiceAccounts: methods.GetTeamServiceAccounts;
}
