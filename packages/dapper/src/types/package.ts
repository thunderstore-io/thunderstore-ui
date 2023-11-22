import { PackageCategory, PaginatedList } from "./shared";
import { TeamMember } from "./team";

export interface PackagePreview {
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

export type PackagePreviews = PaginatedList<PackagePreview>;

export interface Package extends PackagePreview {
  community_name: string;
  datetime_created: string;
  dependant_count: number;
  dependencies?: PackageDependency[];
  full_version_name: string;
  team: PackageTeam;
  versions?: PackageVersion[];
  website_url: string;
}

export interface PackageDependency {
  name: string;
  namespace: string;
  community: string;
  shortDescription: string;
  imageSource?: string;
  version: string;
}

interface PackageTeam {
  name: string;
  members: TeamMember[];
}

interface PackageVersion {
  version: string;
  changelog: string;
  uploadDate: string;
  downloadCount: number;
}
