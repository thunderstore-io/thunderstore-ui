import { expect, it } from "vitest";

import { config, testData } from "../../__tests__/defaultConfig";
import { CommunityListOrderingEnum } from "../../schemas/queryParamSchemas";
import { fetchCommunityList } from "../communityList";

it("finds a community in the community listing", async () => {
  const response = await fetchCommunityList({
    config,
    params: {},
    data: {},
    queryParams: [
      {
        key: "ordering",
        value: CommunityListOrderingEnum.Name,
        impotent: CommunityListOrderingEnum.Name,
      },
      { key: "page", value: 1, impotent: 1 },
      { key: "search", value: undefined },
    ],
  });

  expect(Array.isArray(response.results)).toEqual(true);

  const ror = response.results.find(
    (x: { identifier: string }) => x.identifier === testData.communityId
  );

  expect(ror).toBeDefined();
});
