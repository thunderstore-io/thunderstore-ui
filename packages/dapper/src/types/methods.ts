import { Communities, CommunityData } from "./community";
import { Package, PackageDependency, PackagePreview } from "./package";
import { ServerPreview } from "./server";
import { ServiceAccount, Team } from "./team";
import { User, UserSettings } from "./user";

// TODO: support for sorting and filtering by keyword.
export type GetCommunities = (
  page?: number,
  pageSize?: number
) => Promise<Communities>;

export type GetCommunity = (identifier: string) => Promise<CommunityData>;

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

export type GetTeamList = () => Promise<Team[]>;

export type GetUser = (userId: string) => Promise<{
  user: User;
  packages: PackagePreview[];
  servers: ServerPreview[];
}>;

export type GetUserSettings = (userId: string) => Promise<UserSettings>;
