import { DapperTsInterface } from "../index";

// TODO: this is a dummy implementation required to prevent cyberstorm
// build from breaking.
export async function getCommunities(
  this: DapperTsInterface,
  page = 1,
  pageSize = 100,
  ordering = "name",
  search?: string
) {
  return {
    count: page * pageSize,
    hasMore: ordering === search,
    results: [],
  };
}
