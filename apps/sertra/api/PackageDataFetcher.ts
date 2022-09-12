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
  const mods = await mod_data_fetch;

  const all_versions = new Map();
  mods.map((mod: TSListingMod) => {
    mod.versions.map((version) => {
      const version_with_owner = version as TSListingModVersionWithOwner;
      version_with_owner.owner = mod.owner;
      all_versions.set(version_with_owner.full_name, version_with_owner);
    });
  });
  const updated_listing_mods_data = [];
  for (const mod_ref of listing.mods) {
    const new_mod_data: ListingMod = {
      name: "MOD DETAIL FETCH FAILED: " + mod_ref,
      owner: null,
      version: null,
      icon_url: null,
      description: null,
    };
    const mod = all_versions.get(mod_ref);
    if (mod) {
      new_mod_data.name = mod.name;
      new_mod_data.owner = mod.owner;
      new_mod_data.version = mod.version_number;
      new_mod_data.icon_url = mod.icon;
      new_mod_data.description = mod.description;
    }
    updated_listing_mods_data.push(new_mod_data);
  }
  return {
    listing_data: listing,
    mods_data: updated_listing_mods_data,
  };
};
