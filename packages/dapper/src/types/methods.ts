import { Communities, Community, CommunityFilters } from "./community";
import {
  PackageListingDetails,
  PackageListings,
  PackageVersion,
} from "./package";
import { PackageListingType } from "./props";
import { MarkdownResponse } from "./shared";
import { TeamDetails, ServiceAccount, TeamMember } from "./team";
import { CurrentUser } from "./user";

export type GetCommunities = (
  page?: number,
  ordering?:
    | "aggregated_fields__package_count"
    | "-aggregated_fields__package_count"
    | "aggregated_fields__download_count"
    | "-aggregated_fields__download_count"
    | "datetime_created"
    | "-datetime_created"
    | "name"
    | "-name",
  search?: string
) => Promise<Communities>;

export type GetCommunity = (communityId: string) => Promise<Community>;

export type GetCommunityFilters = (
  communityId: string
) => Promise<CommunityFilters>;

export type GetCurrentUser = () => Promise<CurrentUser>;

export type GetPackageChangelog = (
  namespace: string,
  name: string,
  version?: string
) => Promise<MarkdownResponse>;

export type GetPackageListingDetails = (
  community: string,
  namespace: string,
  name: string
) => Promise<PackageListingDetails>;

export type GetPackageListings = (
  type: PackageListingType,
  ordering?: string,
  page?: number,
  q?: string,
  includedCategories?: string[],
  excludedCategories?: string[],
  section?: string,
  nsfw?: boolean,
  deprecated?: boolean
) => Promise<PackageListings>;

export type GetPackageReadme = (
  namespace: string,
  name: string,
  version?: string
) => Promise<MarkdownResponse>;

export type GetPackageVersions = (
  namespace: string,
  name: string
) => Promise<PackageVersion[]>;

export type GetTeamDetails = (teamName: string) => Promise<TeamDetails>;

export type GetTeamMembers = (teamId: string) => Promise<TeamMember[]>;

export type GetTeamServiceAccounts = (
  teamName: string
) => Promise<ServiceAccount[]>;
