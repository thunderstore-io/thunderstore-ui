import { DapperInterface } from "@thunderstore/dapper";
import { RequestConfig } from "@thunderstore/thunderstore-api";

import { getDynamicHTML } from "./methods/dynamicHTML";
import { getCommunities, getCommunity } from "./methods/communities";
import { getCommunityFilters } from "./methods/communityFilters";
import { getCurrentUser, emptyUser } from "./methods/currentUser";
export const getEmptyUser = emptyUser;
export { currentUserSchema } from "./methods/currentUser";
import {
  getPackageChangelog,
  getPackageReadme,
  getPackageVersions,
} from "./methods/package";
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
    this.getDynamicHTML = this.getDynamicHTML.bind(this);
    this.getCommunities = this.getCommunities.bind(this);
    this.getCommunity = this.getCommunity.bind(this);
    this.getCommunityFilters = this.getCommunityFilters.bind(this);
    this.getCurrentUser = this.getCurrentUser.bind(this);
    this.getPackageChangelog = this.getPackageChangelog.bind(this);
    this.getPackageListings = this.getPackageListings.bind(this);
    this.getPackageListingDetails = this.getPackageListingDetails.bind(this);
    this.getPackageReadme = this.getPackageReadme.bind(this);
    this.getPackageVersions = this.getPackageVersions.bind(this);
    this.getTeamDetails = this.getTeamDetails.bind(this);
    this.getTeamMembers = this.getTeamMembers.bind(this);
    this.getTeamServiceAccounts = this.getTeamServiceAccounts.bind(this);
  }

  public getDynamicHTML = getDynamicHTML;
  public getCommunities = getCommunities;
  public getCommunity = getCommunity;
  public getCommunityFilters = getCommunityFilters;
  public getCurrentUser = getCurrentUser;
  public getPackageChangelog = getPackageChangelog;
  public getPackageListings = getPackageListings;
  public getPackageListingDetails = getPackageListingDetails;
  public getPackageReadme = getPackageReadme;
  public getPackageVersions = getPackageVersions;
  public getTeamDetails = getTeamDetails;
  public getTeamMembers = getTeamMembers;
  public getTeamServiceAccounts = getTeamServiceAccounts;
}
