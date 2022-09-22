import { ListingMod, TSListingMod, TSListingModVersion } from "./models";
import { ApiURLs, TsApiURLs } from "./urls";

interface TSListingModVersionWithOwner extends TSListingModVersion {
  owner: string | null;
}

export const FetchListingData = async (listingId: string) => {
  const listing_data_fetch = fetch(ApiURLs.ServerDetail(listingId)).then((x) =>
    x.json()
  );
  const mod_data_fetch = fetch(TsApiURLs.V1Packages("v-rising")).then((x) =>
    x.json()
  );
  const listing = await listing_data_fetch;
  const mods = (await mod_data_fetch) as TSListingMod[];

  const all_versions = new Map();
  for (const mod of mods as Array<TSListingMod>) {
    const typed_mod = mod as TSListingMod;
    for (const version of typed_mod.versions as Array<TSListingModVersion>) {
      const version_with_owner = version as TSListingModVersionWithOwner;
      version_with_owner.owner = mod.owner;
      all_versions.set(version_with_owner.full_name, version_with_owner);
    }
  }
  const updated_listing_mods_data: Array<ListingMod> = listing.mods.map(
    (x: string) =>
      all_versions.get(x) ?? {
        name: x,
        owner: null,
        version_number: null,
        icon: null,
        description: null,
      }
  );
  return {
    listing_data: listing,
    mods_data: updated_listing_mods_data,
  };
};
