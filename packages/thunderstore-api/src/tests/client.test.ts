import { describe, expect, test } from "@jest/globals";
import { fetchCommunityList } from "../client";

const ASD = {
  identifier: "riskofrain2",
  name: "Risk of Rain 2",
  discord_url: "https://discord.gg/5MbXZvd",
  wiki_url: "https://github.com/risk-of-thunder/R2Wiki/wiki",
  require_package_listing_approval: false,
};

describe("client", () => {
  test("community list contains riskofrain2", () => {
    return fetchCommunityList().then((data) => {
      expect(data.results).toEqual(
        expect.arrayContaining([expect.objectContaining(ASD)])
      );
    });
  });
});
