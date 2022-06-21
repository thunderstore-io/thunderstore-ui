import useSWR, { SWRResponse } from "swr";
import { ApiURLs } from "./urls";
import { fetcher } from "./fetcher";
import { PaginatedResponse, ServerListingData } from "./models";

export const useServerListings = (): SWRResponse<
  PaginatedResponse<ServerListingData>
> => {
  return useSWR<PaginatedResponse<ServerListingData>>(
    ApiURLs.ServerList,
    fetcher
  );
};

export const getServerListings = async (): Promise<
  PaginatedResponse<ServerListingData>
> => {
  return (await fetcher(
    ApiURLs.ServerList
  )) as PaginatedResponse<ServerListingData>;
};
