import { DapperInterface } from "@thunderstore/dapper";
import { RequestConfig } from "@thunderstore/thunderstore-api";

import { getCommunities, getCommunity } from "./methods/communities";
import { getCommunityFilters } from "./methods/communityFilters";
import { getCurrentUser } from "./methods/currentUser";
import {
  getPackageListingDetails,
  getPackageListings,
} from "./methods/packageListings";
import {
  getTeamDetails,
  getTeamMembers,
  getTeamServiceAccounts,
} from "./methods/team";

export interface DapperTsInterface extends DapperInterface {
  config: RequestConfig;
}

export class DapperTs implements DapperTsInterface {
  config: RequestConfig;

  constructor(config: RequestConfig) {
    this.config = config;
    this.getCommunities = this.getCommunities.bind(this);
    this.getCommunity = this.getCommunity.bind(this);
    this.getCommunityFilters = this.getCommunityFilters.bind(this);
    this.getCurrentUser = this.getCurrentUser.bind(this);
    this.getPackageListings = this.getPackageListings.bind(this);
    this.getPackageListingDetails = this.getPackageListingDetails.bind(this);
    this.getTeamDetails = this.getTeamDetails.bind(this);
    this.getTeamMembers = this.getTeamMembers.bind(this);
    this.getTeamServiceAccounts = this.getTeamServiceAccounts.bind(this);
  }

  public getCommunities = getCommunities;
  public getCommunity = getCommunity;
  public getCommunityFilters = getCommunityFilters;
  public getCurrentUser = getCurrentUser;
  public getPackageListings = getPackageListings;
  public getPackageListingDetails = getPackageListingDetails;
  public getTeamDetails = getTeamDetails;
  public getTeamMembers = getTeamMembers;
  public getTeamServiceAccounts = getTeamServiceAccounts;
}
