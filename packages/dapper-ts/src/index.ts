import type { DapperInterface } from "@thunderstore/dapper";
import type { RequestConfig } from "@thunderstore/thunderstore-api";

import { getCommunities, getCommunity } from "./methods/communities";
import { getCommunityFilters } from "./methods/communityFilters";
import {
  getCurrentUser,
  getCurrentUserTeamPermissions,
} from "./methods/currentUser";
import { getDynamicHTML } from "./methods/dynamicHTML";
import {
  getPackageChangelog,
  getPackagePermissions,
  getPackageReadme,
  getPackageSource,
  getPackageSubmissionStatus,
  getPackageVersionDependencies,
  getPackageVersions,
  getPackageWiki,
  getPackageWikiPage,
  postPackageSubmissionMetadata,
} from "./methods/package";
import {
  getPackageListingDetails,
  getPackageListings,
} from "./methods/packageListings";
import { getPackageVersionDetails } from "./methods/packageVersion";
import { getRatedPackages } from "./methods/ratedPackages";
import {
  getTeamDetails,
  getTeamMembers,
  getTeamServiceAccounts,
  postTeamCreate,
} from "./methods/team";

export interface DapperTsInterface extends DapperInterface {
  config: () => RequestConfig;
  removeSessionHook?: () => void;
}

export class DapperTs implements DapperTsInterface {
  config: () => RequestConfig;
  removeSessionHook?: () => void;

  constructor(config: () => RequestConfig, removeSessionHook?: () => void) {
    this.config = config;
    this.removeSessionHook = removeSessionHook;
    this.getDynamicHTML = this.getDynamicHTML.bind(this);
    this.getCommunities = this.getCommunities.bind(this);
    this.getCommunity = this.getCommunity.bind(this);
    this.getCommunityFilters = this.getCommunityFilters.bind(this);
    this.getRatedPackages = this.getRatedPackages.bind(this);
    this.getCurrentUser = this.getCurrentUser.bind(this);
    this.getCurrentUserTeamPermissions =
      this.getCurrentUserTeamPermissions.bind(this);
    this.getPackageChangelog = this.getPackageChangelog.bind(this);
    this.getPackageListings = this.getPackageListings.bind(this);
    this.getPackageListingDetails = this.getPackageListingDetails.bind(this);
    this.getPackageReadme = this.getPackageReadme.bind(this);
    this.getPackageVersionDetails = this.getPackageVersionDetails.bind(this);
    this.getPackageVersions = this.getPackageVersions.bind(this);
    this.getPackageVersionDependencies =
      this.getPackageVersionDependencies.bind(this);
    this.getPackageWiki = this.getPackageWiki.bind(this);
    this.getPackageWikiPage = this.getPackageWikiPage.bind(this);
    this.getPackagePermissions = this.getPackagePermissions.bind(this);
    this.getPackageSource = this.getPackageSource.bind(this);
    this.getTeamDetails = this.getTeamDetails.bind(this);
    this.getTeamMembers = this.getTeamMembers.bind(this);
    this.getTeamServiceAccounts = this.getTeamServiceAccounts.bind(this);
    this.postTeamCreate = this.postTeamCreate.bind(this);
    this.postPackageSubmissionMetadata =
      this.postPackageSubmissionMetadata.bind(this);
    this.getPackageSubmissionStatus =
      this.getPackageSubmissionStatus.bind(this);
  }

  public getDynamicHTML = getDynamicHTML;
  public getCommunities = getCommunities;
  public getCommunity = getCommunity;
  public getCommunityFilters = getCommunityFilters;
  public getRatedPackages = getRatedPackages;
  public getCurrentUser = getCurrentUser;
  public getCurrentUserTeamPermissions = getCurrentUserTeamPermissions;
  public getPackageChangelog = getPackageChangelog;
  public getPackageListings = getPackageListings;
  public getPackageListingDetails = getPackageListingDetails;
  public getPackageReadme = getPackageReadme;
  public getPackageVersions = getPackageVersions;
  public getPackageVersionDependencies = getPackageVersionDependencies;
  public getPackageVersionDetails = getPackageVersionDetails;
  public getPackageWiki = getPackageWiki;
  public getPackageWikiPage = getPackageWikiPage;
  public getPackagePermissions = getPackagePermissions;
  public getPackageSource = getPackageSource;
  public getTeamDetails = getTeamDetails;
  public getTeamMembers = getTeamMembers;
  public getTeamServiceAccounts = getTeamServiceAccounts;
  public postTeamCreate = postTeamCreate;
  public postPackageSubmissionMetadata = postPackageSubmissionMetadata;
  public getPackageSubmissionStatus = getPackageSubmissionStatus;
}

export {
  getCommunities,
  getCommunity,
  getCommunityFilters,
  getCurrentUser,
  getCurrentUserTeamPermissions,
  getDynamicHTML,
  getPackageChangelog,
  getPackageListingDetails,
  getPackageListings,
  getPackagePermissions,
  getPackageReadme,
  getPackageSource,
  getPackageSubmissionStatus,
  getPackageVersionDependencies,
  getPackageVersionDetails,
  getPackageVersions,
  getPackageWiki,
  getPackageWikiPage,
  getRatedPackages,
  getTeamDetails,
  getTeamMembers,
  getTeamServiceAccounts,
  postPackageSubmissionMetadata,
  postTeamCreate,
};
