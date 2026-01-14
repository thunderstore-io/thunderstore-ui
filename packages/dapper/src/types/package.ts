import { type PackageCategory, type PaginatedList } from "./shared";
import { type TeamMember } from "./team";

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
  dependencies: PackageListingDependency[];
  dependency_count: number;
  download_url: string;
  full_version_name: string;
  has_changelog: boolean;
  install_url: string;
  latest_version_number: string;
  listing_admin_url?: string | null;
  package_admin_url?: string | null;
  team: PackageTeam;
  website_url: string | null;
}

export interface PackageListingDependency {
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

export interface PackageVersionDependency {
  description: string;
  icon_url: string;
  is_active: boolean;
  name: string;
  namespace: string;
  version_number: string;
  is_removed: boolean;
}

export type PackageVersionDependencies = {
  count: number;
  previous: string | null;
  next: string | null;
  results: PackageVersionDependency[];
};

export interface PackagePermissions {
  package: {
    community_id: string;
    namespace_id: string;
    package_name: string;
  };
  permissions: {
    can_manage: boolean;
    can_manage_deprecation: boolean;
    can_manage_categories: boolean;
    can_deprecate: boolean;
    can_undeprecate: boolean;
    can_unlist: boolean;
    can_moderate: boolean;
    can_view_package_admin_page: boolean;
    can_view_listing_admin_page: boolean;
  };
}

export interface PackageSource {
  is_visible: boolean;
  namespace: string;
  package_name: string;
  version_number: string;
  last_decompilation_date?: string | null;
  decompilations: Decompilation[];
}

interface Decompilation {
  source_file_name: string;
  url: string;
  result_size: string;
  result: string;
  is_truncated: boolean;
}

export interface PackageSubmissionError {
  upload_uuid?: string[] | null;
  author_name?: string[] | null;
  categories?: string[] | null;
  communities?: string[] | null;
  has_nsfw_content?: string[] | null;
  detail?: string[] | null;
  file?: string[] | null;
  team?: string[] | null;
  __all__?: string[] | null;
}

export interface PackageSubmissionResult {
  package_version: {
    namespace: string;
    name: string;
    version_number: string;
    full_name: string;
    description: string;
    icon: string;
    dependencies: string[];
    download_url: string;
    downloads: number;
    date_created: string;
    website_url: string | null;
    is_active: boolean;
  };
  available_communities: Array<{
    community: {
      identifier: string;
      name: string;
      discord_url: string | null;
      wiki_url: string | null;
      require_package_listing_approval: boolean;
    };
    categories: Array<{
      name: string;
      slug: string;
    }>;
    url: string;
  }>;
}

export interface PackageSubmissionStatus {
  id: string;
  status: string;
  form_errors: PackageSubmissionError | null;
  task_error: boolean | null;
  result: PackageSubmissionResult | null;
}

export type PackageSubmissionResponse =
  | PackageSubmissionStatus
  | PackageSubmissionError;
