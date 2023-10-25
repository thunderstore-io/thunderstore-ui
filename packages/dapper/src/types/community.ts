import { PaginatedList } from "./shared";

export type Community = {
  name: string;
  identifier: string;
  description: string | null;
  discord_url: string | null;
  datetime_created: string;
  background_image_url: string | null;
  icon_url: string | null;
  total_download_count: number;
  total_package_count: number;
};

export type Communities = PaginatedList<Community>;
