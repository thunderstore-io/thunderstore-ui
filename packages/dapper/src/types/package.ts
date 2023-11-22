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
  gitHubLink?: string;
  firstUploaded?: string;
  dependencyString: string;
  dependencies?: PackageDependency[];
  dependantCount: number;
  team: PackageTeam;
  versions?: PackageVersion[];
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
