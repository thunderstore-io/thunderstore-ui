import { DapperInterface } from "@thunderstore/dapper";

// Original idea was for NotImlemented to throw an error, but that
// causes the build cyberstorm-nextjs to fail, which causes CI pipeline
// to block merging.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NotImplemented: any = async () => {
  console.error("DapperTs has not implemented a provider method");
  return [];
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
