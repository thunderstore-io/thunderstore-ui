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

export interface ServerListingData extends ServerListingBase {}

export interface ServerListingDetailData extends ServerListingBase {
  mods: string[];
}

export interface PaginatedResponse<T> {
  next: string | null;
  previous: string | null;
  results: T[];
}
