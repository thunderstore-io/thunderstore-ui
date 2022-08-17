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
  mod_count: number;
}

export interface ServerListingData extends ServerListingBase {}

export interface ServerListingDetailData extends ServerListingBase {
  mods: string[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
