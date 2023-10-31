import { PackageCategory, PaginatedList } from "./shared";

export interface Community {
  name: string;
  identifier: string;
  description: string | null;
  discord_url: string | null;
  datetime_created: string;
  background_image_url: string | null;
  icon_url: string | null;
  total_download_count: number;
  total_package_count: number;
}

export type Communities = PaginatedList<Community>;

export interface Section {
  name: string;
  slug: string;
  priority: number;
}

export interface CommunityFilters {
  package_categories: PackageCategory[];
  sections: Section[];
}
