import { DapperInterface } from "@thunderstore/dapper";

const NotImplemented = () => {
  throw new Error("DapperTs has not implemented a provider method");
};

export class DapperTs implements DapperInterface {
  public getCommunities = NotImplemented;
  public getCommunity = NotImplemented;
  public getPackage = NotImplemented;
  public getPackageDependencies = NotImplemented;
  public getPackageListings = NotImplemented;
  public getServiceAccount = NotImplemented;
  public getServiceAccountList = NotImplemented;
  public getTeam = NotImplemented;
  public getTeamList = NotImplemented;
  public getUser = NotImplemented;
  public getUserSettings = NotImplemented;
}
