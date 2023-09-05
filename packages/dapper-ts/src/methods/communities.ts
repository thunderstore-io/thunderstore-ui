// TODO: this is a dummy implementation required to prevent cyberstorm
// build from breaking.
export const getCommunities = async (
  page = 1,
  pageSize = 100,
  ordering = "name"
) => ({
  count: page * pageSize,
  hasMore: ordering === "name",
  results: [],
});
