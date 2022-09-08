interface ServerListingBase {
  id: string;
  name: string;
  description: string;
  community: string;
  connection_data: string;
  is_pvp: boolean;
  requires_password: boolean;
  datetime_created: string;
  datetime_updated: string;
}

export interface ServerListingData extends ServerListingBase {
  mod_count: number;
}

export interface TSListingModVersions {
  name: string;
  full_name: string;
  description: string | null;
  icon: string | null; // This is an url
  version_number: string;
  dependencies: [];
  download_url: string;
  downloads: number;
  date_created: string;
  website_url: string | null;
  is_active: boolean;
  uuid4: string;
  file_size: number;
}

export interface TSListingMod {
  name: string;
  full_name: string;
  owner: string | null;
  package_url: string;
  date_created: string;
  date_updated: string;
  uuid: string;
  rating_score: number;
  is_pinned: boolean;
  is_deprecated: boolean;
  has_nsfw_content: boolean;
  versions: TSListingModVersions[];
  categories: [];
}

export interface ListingMod {
  name: string;
  owner: string | null;
  description: string | null;
  version: string | null;
  icon_url: string | null;
}

export interface ServerListingDetailData extends ServerListingBase {
  mods: ListingMod[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface PackageVersion {
  name: string;
  full_name: string;
  description: string;
  icon: string;
  version_number: string;
  dependencies: string[];
  download_url: string;
  downloads: number;
  website_url: string;
  date_created: string;
  uuid4: string;
  file_size: number;
  is_active: boolean;
}

export interface Package {
  name: string;
  full_name: string;
  owner: string;
  package_url: string;
  date_created: string;
  date_updated: string;
  uuid4: string;
  rating_score: number;
  is_pinned: boolean;
  is_deprecated: boolean;
  has_nsfw_content: boolean;
  categories: string[];
  versions: PackageVersion[];
}
