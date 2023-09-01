import * as methods from "./types/methods";

export interface DapperInterface {
  sessionId?: string;

  getCommunities: methods.GetCommunities;
  getCommunity: methods.GetCommunity;
  getPackage: methods.GetPackage;
  getPackageDependencies: methods.GetPackageDependencies;
  getPackageListings: methods.GetPackageListings;
  getServiceAccount: methods.GetServiceAccount;
  getServiceAccountList: methods.GetServiceAccountList;
  getTeam: methods.GetTeam;
  getTeamList: methods.GetTeamList;
  getUser: methods.GetUser;
  getUserSettings: methods.GetUserSettings;
}
