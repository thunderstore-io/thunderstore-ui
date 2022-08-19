import useSWR, { SWRResponse } from "swr";
import { ApiURLs } from "./urls";
import { fetcher } from "./fetcher";
import { PaginatedResponse, ServerListingData } from "./models";

export const useServerListings = (
  cursor?: string
): SWRResponse<PaginatedResponse<ServerListingData>> => {
  const url = `${ApiURLs.ServerList}${cursor ? `?cursor=${cursor}` : ""}`;
  return useSWR<PaginatedResponse<ServerListingData>>(url, fetcher);
};

export const getServerListings = async (): Promise<
  PaginatedResponse<ServerListingData>
> => {
  return (await fetcher(
    ApiURLs.ServerList
  )) as PaginatedResponse<ServerListingData>;
};
