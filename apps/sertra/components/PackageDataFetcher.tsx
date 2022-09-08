import { ApiURLs, TsApiURLs } from "../api/urls";

export const FetchListingData = async (listingId: string) => {
  const res = await fetch(ApiURLs.ServerDetail(listingId));
  const mods_res = await fetch(TsApiURLs.V1Packages("v-rising"));
  const data = await res.json();
  const mods_data = await mods_res.json();

  const updated_listing_mods_data = [];
  for (const mod_ref of data.mods) {
    const new_mod_data = {
      name: "MOD DETAIL FETCH FAILED: " + mod_ref,
      owner: null,
      version: null,
      icon_url: null,
      description: null,
    };
    for (const mod of mods_data) {
      if (mod_ref.startsWith(mod.full_name)) {
        new_mod_data.name = mod.name;
        new_mod_data.owner = mod.owner;
        new_mod_data.version = null;
        for (const version of mod.versions) {
          if (mod_ref.endsWith(version.version_number)) {
            new_mod_data.version = version.version_number;
            new_mod_data.icon_url = version.icon ?? null;
            new_mod_data.description = version.description ?? null;
            break;
          }
        }
      }
    }
    updated_listing_mods_data.push(new_mod_data);
  }
  return {
    listing_data: data,
    mods_data: updated_listing_mods_data,
  };
};
