import { ServerPreview } from "./server";
import { PaginatedList } from "./utils";

export type Community = {
  name: string;
  identifier: string;

  total_download_count: number;
  total_package_count: number;
  total_server_count: number;
  background_image_url?: string | null;
  portrait_image_url?: string | null;

  description?: string | null;
  discord_url?: string | null;
};

export type CommunityList = PaginatedList<Community>;

export type CommunityData = {
  community: Community;
  servers: ServerPreview[];
};
