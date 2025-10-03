import { type PackageCategory, type PaginatedList } from "./shared";

export interface Community {
  name: string;
  identifier: string;
  short_description: string | null;
  description: string | null;
  wiki_url: string | null;
  discord_url: string | null;
  datetime_created: string;
  hero_image_url: string | null;
  cover_image_url: string | null;
  icon_url: string | null;
  community_icon_url: string | null;
  total_download_count: number;
  total_package_count: number;
}

export type Communities = PaginatedList<Community>;

export interface Section {
  uuid: string;
  name: string;
  slug: string;
  priority: number;
}

export interface CommunityFilters {
  package_categories: PackageCategory[];
  sections: Section[];
}
