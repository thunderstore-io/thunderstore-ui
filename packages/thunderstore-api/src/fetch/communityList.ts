import { apiFetch } from "../apiFetch";

export async function fetchCommunityList() {
  return await apiFetch("https://thunderstore.dev/api/experimental/community/");
}
