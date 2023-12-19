import { PackageCategory, PaginatedList } from "./shared";
import { TeamMember } from "./team";

export interface PackageListing {
  categories: PackageCategory[];
  community_identifier: string;
  description: string;
  download_count: number;
  icon_url: string | null;
  is_deprecated: boolean;
  is_nsfw: boolean;
  is_pinned: boolean;
  last_updated: string;
  name: string;
  namespace: string;
  rating_count: number;
  size: number;
}

export type PackageListings = PaginatedList<PackageListing>;

export interface PackageListingDetails extends PackageListing {
  community_name: string;
  datetime_created: string;
  dependant_count: number;
  full_version_name: string;
  has_changelog: boolean;
  latest_version_number: string;
  team: PackageTeam;
  website_url: string | null;
}

export interface PackageDependency {
  community_identifier: string;
  description: string;
  icon_url: string | null;
  name: string;
  namespace: string;
  version_number: string;
}

interface PackageTeam {
  name: string;
  members: TeamMember[];
}

// interface PackageVersion {
//   version_number: string;
//   changelog: string;
//   datetime_created: string;
//   download_count: number;
// }
