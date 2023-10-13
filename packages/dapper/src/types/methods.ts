import { Communities, CommunityDetails } from "./community";
import { Package, PackageDependency, PackagePreview } from "./package";
import { TeamDetails, ServiceAccount, TeamMember } from "./team";
import { CurrentUser } from "./user";

export type GetCommunities = (
  page?: number,
  ordering?: "datetime_created" | "-datetime_created" | "name" | "-name",
  search?: string
) => Promise<Communities>;

export type GetCommunity = (communityId: string) => Promise<CommunityDetails>;

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
  communityId?: string,
  userId?: string,
  namespaceId?: string,
  teamId?: string,
  keywords?: string[],
  categories?: {
    [key: string]: {
      value: boolean | undefined;
    };
  }
) => Promise<PackagePreview[]>;

export type GetTeamDetails = (teamName: string) => Promise<TeamDetails>;

export type GetTeamMembers = (teamId: string) => Promise<TeamMember[]>;

export type GetTeamServiceAccounts = (
  teamName: string
) => Promise<ServiceAccount[]>;
