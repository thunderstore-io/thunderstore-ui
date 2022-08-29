import useSWR, { SWRResponse } from "swr";
import { ApiURLs, TsApiURLs } from "./urls";
import { fetcher } from "./fetcher";
import {
  Package,
  PaginatedResponse,
  ServerListingData,
  ServerListingDetailData,
} from "./models";

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

export const usePackageList = (community: string): SWRResponse<Package[]> => {
  return useSWR<Package[]>(TsApiURLs.V1Packages(community), fetcher);
};

export const getPackageList = async (community: string): Promise<Package[]> => {
  return (await fetcher(TsApiURLs.V1Packages(community))) as Package[];
};

export const useServerListingDetail = (
  id: string
): SWRResponse<ServerListingDetailData> => {
  return useSWR<ServerListingDetailData>(ApiURLs.ServerDetail(id), fetcher);
};
