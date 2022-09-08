import { useEffect, useState } from "react";
import { ListingMod, TSListingMod } from "../api/models";
import { ApiURLs, TsApiURLs } from "../api/urls";

// TODO: To be replaced with ServerListingDetailData when the listing will contain an actual
// object instead of an list of strings

interface TempModRefType {
  mods: string[];
}

export const FetchListingData = async (listingId: string) => {
  const [listing, setListing] = useState<TempModRefType>();
  useEffect(() => {
    async function fetchListing() {
      return await fetch(ApiURLs.ServerDetail(listingId));
    }
    async function jsonifyListing() {
      setListing(await (await fetchListing()).json());
    }
    jsonifyListing();
  });

  const [mods, setMods] = useState<TSListingMod[]>([]);
  useEffect(() => {
    async function fetchMods() {
      return await fetch(TsApiURLs.V1Packages("v-rising"));
    }
    async function jsonifyMods() {
      setMods(await (await fetchMods()).json());
    }
    jsonifyMods();
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
    for (const mod of mods) {
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
