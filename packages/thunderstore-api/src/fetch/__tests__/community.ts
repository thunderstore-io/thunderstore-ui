import { config, testData } from "./defaultConfig";
import { fetchCommunity } from "../community";

it("ensures RoR2 community exists", async () => {
  const response = await fetchCommunity(config, testData.communityId);

  expect(response.identifier).toStrictEqual(testData.communityId);
  expect(typeof response.name).toStrictEqual("string");
});
