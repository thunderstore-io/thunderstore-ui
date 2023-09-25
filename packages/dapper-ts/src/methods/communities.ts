import { DapperTsInterface } from "../index";

// TODO: this is a dummy implementation required to prevent cyberstorm
// build from breaking.
export async function getCommunities(
  this: DapperTsInterface,
  page = 1,
  ordering = "name",
  search?: string
) {
  return {
    count: page * 150,
    hasMore: ordering === search,
    results: [],
  };
}
