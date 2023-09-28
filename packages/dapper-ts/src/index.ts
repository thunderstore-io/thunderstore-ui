import { DapperInterface } from "@thunderstore/dapper";
import { RequestConfig } from "@thunderstore/thunderstore-api";

import { getCommunities } from "./methods/communities";
import { getCurrentUser } from "./methods/currentUser";

// Original idea was for NotImlemented to throw an error, but that
// causes the build cyberstorm-nextjs to fail, which causes CI pipeline
// to block merging.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NotImplemented: any = async () => {
  console.error("DapperTs has not implemented a provider method");
  return [];
};

export interface DapperTsInterface extends DapperInterface {
  config: RequestConfig;
}

export class DapperTs implements DapperTsInterface {
  config: RequestConfig;

  constructor(config: RequestConfig) {
    this.config = config;
    this.getCommunities = this.getCommunities.bind(this);
    this.getCurrentUser = this.getCurrentUser.bind(this);
  }

  public getCommunities = getCommunities;
  public getCurrentUser = getCurrentUser;

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
