import {
  ListingMod,
  ServerListingDetailData,
  TSListingMod,
  TSListingModVersion,
} from "./models";
import { ApiURLs, TsApiURLs } from "./urls";

interface TSListingModVersionWithOwner extends TSListingModVersion {
  owner: string | null;
}
interface ListingData {
  listing_data: ServerListingDetailData;
  mods_data: ListingMod[];
}

const getListingDetail = (
  listingId: string
): Promise<ServerListingDetailData> =>
  fetch(ApiURLs.ServerDetail(listingId)).then((x) => x.json());

// TODO: Add caching
const getModIndex = (communityId: string): Promise<TSListingMod[]> =>
  fetch(TsApiURLs.V1Packages(communityId)).then((x) => x.json());

export const FetchListingData = async (
  listingId: string,
  communityId: string
): Promise<ListingData> => {
  const listingPromise = getListingDetail(listingId);
  const modIndexPromise = getModIndex(communityId);

  const all_versions = new Map<string, TSListingModVersionWithOwner>();
  for (const mod of await modIndexPromise) {
    for (const version of mod.versions) {
      all_versions.set(version.full_name, {
        ...version,
        owner: mod.owner,
      });
    }
  }

  const listing = await listingPromise;
  const listing_mods = listing.mods.map(
    (x) =>
      all_versions.get(x) ?? {
        name: x,
        full_name: x,
        owner: null,
        version_number: null,
        icon: null,
        description: null,
      }
  );

  return {
    listing_data: listing,
    mods_data: listing_mods,
  };
};
