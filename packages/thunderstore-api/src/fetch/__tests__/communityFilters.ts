import { config } from "./defaultConfig";
import { fetchCommunityFilters } from "../communityFilters";

it("ensures filters contain categories and sections", async () => {
  const response = await fetchCommunityFilters(config, "riskofrain2");

  expect(Array.isArray(response.package_categories)).toBeTruthy();
  expect(Array.isArray(response.sections)).toBeTruthy();
});
