import fetch from "node-fetch";

class CommunityListResponse {
  pagination: {
    next_link: string | unknown;
    previous_link: string | unknown;
  };
  results: {
    identifier: string | unknown;
    name: string | unknown;
    discord_url: string | unknown;
    wiki_url: string | unknown;
    require_package_listing_approval: boolean;
  }[];
}

function apiFetch(path: string) {
  return fetch(path, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
}

export async function fetchCommunityList() {
  const data = await apiFetch(
    "https://thunderstore.io/api/experimental/community/"
  )
    .then((response) => response.json())
    .then((responseData) =>
      Object.assign(new CommunityListResponse(), responseData)
    );
  return data;
}
