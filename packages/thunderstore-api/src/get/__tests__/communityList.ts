import { config, testData } from "./defaultConfig";
import { fetchCommunityList } from "../communityList";

it("finds a community in the community listing", async () => {
  const response = await fetchCommunityList(config);

  expect(Array.isArray(response.results)).toEqual(true);

  const ror = response.results.find(
    (x: { identifier: string }) => x.identifier === testData.communityId
  );

  expect(ror).toBeDefined();
});
