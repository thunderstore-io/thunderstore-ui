import { config, testData } from "../../__tests__/defaultConfig";
import { fetchCommunityPackageListings } from "../communityPackageListings";
import { PackageListingsOrderingEnum } from "../../schemas/queryParamSchemas";
import { it, expect } from "vitest";

interface PartialPackage {
  community_identifier: string;
}

it("receives community scoped paginated package listing", async () => {
  const { communityId } = testData;
  const response = await fetchCommunityPackageListings({
    config,
    params: { community_id: communityId },
    data: {},
    queryParams: [
      {
        key: "ordering",
        value: PackageListingsOrderingEnum.Updated,
        impotent: PackageListingsOrderingEnum.Updated,
      },
      { key: "page", value: 1, impotent: 1 },
      { key: "q", value: "" },
      { key: "included_categories", value: [] },
      { key: "excluded_categories", value: [] },
      { key: "section", value: "" },
      { key: "nsfw", value: false, impotent: false },
      { key: "deprecated", value: false, impotent: false },
    ],
  });

  expect(typeof response.count).toEqual("number");
  expect(Array.isArray(response.results)).toEqual(true);

  response.results.forEach((pkg: PartialPackage) => {
    expect(pkg.community_identifier.toLowerCase()).toStrictEqual(communityId);
  });
});
