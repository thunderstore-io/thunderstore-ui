import { config, testData } from "../../__tests__/defaultConfig";
import { fetchCommunityFilters } from "../communityFilters";

it("ensures filters contain categories and sections", async () => {
  const response = await fetchCommunityFilters({
    config,
    params: { community_id: testData.communityId },
    data: {},
    queryParams: {},
  });

  expect(Array.isArray(response.package_categories)).toBeTruthy();
  expect(Array.isArray(response.sections)).toBeTruthy();
});
