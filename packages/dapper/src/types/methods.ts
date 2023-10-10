import { Communities, Community } from "./community";
import { Package, PackageDependency, PackagePreview } from "./package";
import {
  ServiceAccount,
  Team,
  TeamDetails,
  TempServiceAccount,
  TempTeamMember,
} from "./team";
import { CurrentUser } from "./user";

export type GetCommunities = (
  page?: number,
  ordering?: "datetime_created" | "-datetime_created" | "name" | "-name",
  search?: string
) => Promise<Communities>;

export type GetCommunity = (communityId: string) => Promise<Community>;

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

export type GetServiceAccount = (
  serviceAccountId: string
) => Promise<ServiceAccount>;

export type GetServiceAccountList = (
  teamId: string
) => Promise<ServiceAccount[]>;

export type GetTeam = (teamId: string) => Promise<Team>;

export type GetTeamDetails = (teamName: string) => Promise<TeamDetails>;

export type GetTeamMembers = (teamId: string) => Promise<TempTeamMember[]>;

export type GetTeamServiceAccounts = (
  teamName: string
) => Promise<TempServiceAccount[]>;
