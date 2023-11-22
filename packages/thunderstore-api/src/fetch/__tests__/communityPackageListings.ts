import { config } from "./defaultConfig";
import { fetchCommunityPackageListings } from "../communityPackageListings";

interface PartialPackage {
  community_identifier: string;
}

it("receives community scoped paginated package listing", async () => {
  const communityId = "riskofrain2";
  const response = await fetchCommunityPackageListings(config, communityId);

  expect(typeof response.count).toEqual("number");
  expect(Array.isArray(response.results)).toEqual(true);

  response.results.forEach((pkg: PartialPackage) => {
    expect(pkg.community_identifier.toLowerCase()).toStrictEqual(communityId);
  });
});
