import { PackageCategory, PaginatedList } from "./shared";
import { TeamMember } from "./team";

export interface PackageListing {
  categories: PackageCategory[];
  community_identifier: string;
  description: string;
  download_count: number;
  icon_url: string;
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
  dependencies: PackageDependency[];
  dependency_count: number;
  download_url: string;
  full_version_name: string;
  has_changelog: boolean;
  install_url: string;
  latest_version_number: string;
  team: PackageTeam;
  website_url: string | null;
}

export interface PackageDependency {
  community_identifier: string;
  description: string;
  icon_url: string | null;
  is_active: boolean;
  name: string;
  namespace: string;
  version_number: string;
}

interface PackageTeam {
  name: string;
  members: TeamMember[];
}

export interface PackageVersion {
  version_number: string;
  datetime_created: string;
  download_count: number;
  download_url: string;
  install_url: string;
}

export interface PackageSubmissionError {
  upload_uuid?: string[];
  author_name?: string[];
  categories?: string[];
  communities?: string[];
  has_nsfw_content?: string[];
  detail?: string;
  file?: string[];
  team?: string[];
  __all__?: string[];
}

export interface PackageSubmissionStatus {
  id: string;
  status: string;
  form_errors: PackageSubmissionError | null;
  task_error: boolean | null;
  result: string | null;
}

export type PackageSubmissionResponse =
  | PackageSubmissionStatus
  | PackageSubmissionError;
