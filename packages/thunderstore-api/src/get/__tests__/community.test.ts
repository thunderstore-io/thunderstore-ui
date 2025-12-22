import { expect, it } from "vitest";

import { config, testData } from "../../__tests__/defaultConfig";
import { fetchCommunity } from "../community";

it("ensures a community exists", async () => {
  const response = await fetchCommunity({
    config,
    params: { community_id: testData.communityId },
    data: {},
    queryParams: {},
  });

  expect(response.identifier).toStrictEqual(testData.communityId);
  expect(typeof response.name).toStrictEqual("string");
});
