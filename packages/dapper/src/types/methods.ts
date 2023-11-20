import { Communities, Community, CommunityFilters } from "./community";
import { Package, PackageDependency, PackagePreviews } from "./package";
import { PackageListingType } from "./props";
import { TeamDetails, ServiceAccount, TeamMember } from "./team";
import { CurrentUser } from "./user";

export type GetCommunities = (
  page?: number,
  ordering?: "datetime_created" | "-datetime_created" | "name" | "-name",
  search?: string
) => Promise<Communities>;

export type GetCommunity = (communityId: string) => Promise<Community>;

export type GetCommunityFilters = (
  communityId: string
) => Promise<CommunityFilters>;

export type GetCurrentUser = () => Promise<CurrentUser>;

export type GetPackage = (
  community: string,
  namespace: string,
  name: string
) => Promise<Package>;

// TODO: is this right? how do we fetch dependencies without knowing the
// package name?
export type GetPackageDependencies = (
  community: string,
  namespace: string
) => Promise<PackageDependency[]>;

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
) => Promise<PackagePreviews>;

export type GetTeamDetails = (teamName: string) => Promise<TeamDetails>;

export type GetTeamMembers = (teamId: string) => Promise<TeamMember[]>;

export type GetTeamServiceAccounts = (
  teamName: string
) => Promise<ServiceAccount[]>;
