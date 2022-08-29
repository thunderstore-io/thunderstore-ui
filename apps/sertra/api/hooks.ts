import useSWR, { SWRResponse } from "swr";
import { ApiURLs, TsApiURLs } from "./urls";
import { fetcher } from "./fetcher";
import { Package, PaginatedResponse, ServerListingData } from "./models";

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

export const usePackageList = (community: string): SWRResponse<Package[]> => {
  return useSWR<Package[]>(TsApiURLs.V1Packages(community), fetcher);
};

export const getPackageList = async (community: string): Promise<Package[]> => {
  return (await fetcher(TsApiURLs.V1Packages(community))) as Package[];
};

export const usePackageList = (community: string): SWRResponse<Package[]> => {
  return useSWR<Package[]>(TsApiURLs.V1Packages(community), fetcher);
};

export const getPackageList = async (community: string): Promise<Package[]> => {
  return (await fetcher(TsApiURLs.V1Packages(community))) as Package[];
};
