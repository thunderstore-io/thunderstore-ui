import { DapperInterface } from "@thunderstore/dapper";
import { RequestConfig } from "@thunderstore/thunderstore-api";

import { getDynamicHTML } from "./methods/dynamicHTML";
import { getCommunities, getCommunity } from "./methods/communities";
import { getCommunityFilters } from "./methods/communityFilters";
import { getRatedPackages } from "./methods/ratedPackages";
import { getCurrentUser } from "./methods/currentUser";
import {
  getPackageChangelog,
  getPackageReadme,
  getPackageVersions,
  postPackageSubmissionMetadata,
  getPackageSubmissionStatus,
  getPackageWiki,
  getPackageWikiPage,
} from "./methods/package";
import {
  getPackageListingDetails,
  getPackageListings,
} from "./methods/packageListings";
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
    this.getPackageChangelog = this.getPackageChangelog.bind(this);
    this.getPackageListings = this.getPackageListings.bind(this);
    this.getPackageListingDetails = this.getPackageListingDetails.bind(this);
    this.getPackageReadme = this.getPackageReadme.bind(this);
    this.getPackageVersions = this.getPackageVersions.bind(this);
    this.getPackageWiki = this.getPackageWiki.bind(this);
    this.getPackageWikiPage = this.getPackageWikiPage.bind(this);
    this.getTeamDetails = this.getTeamDetails.bind(this);
    this.getTeamMembers = this.getTeamMembers.bind(this);
    this.getTeamServiceAccounts = this.getTeamServiceAccounts.bind(this);
    this.postTeamCreate = () => this.postTeamCreate.bind(this);
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
  public getPackageChangelog = getPackageChangelog;
  public getPackageListings = getPackageListings;
  public getPackageListingDetails = getPackageListingDetails;
  public getPackageReadme = getPackageReadme;
  public getPackageVersions = getPackageVersions;
  public getPackageWiki = getPackageWiki;
  public getPackageWikiPage = getPackageWikiPage;
  public getTeamDetails = getTeamDetails;
  public getTeamMembers = getTeamMembers;
  public getTeamServiceAccounts = getTeamServiceAccounts;
  public postTeamCreate = postTeamCreate;
  public postPackageSubmissionMetadata = postPackageSubmissionMetadata;
  public getPackageSubmissionStatus = getPackageSubmissionStatus;
}
