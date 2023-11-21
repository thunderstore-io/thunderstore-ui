import { config } from "./defaultConfig";
import { fetchPackageDependantsListings } from "../packageDependantsListings";

interface PartialPackage {
  community_identifier: string;
  namespace: string;
}

it("receives listing of packages depending on given package", async () => {
  const communityId = "riskofrain2";
  const namespaceId = "testteam";
  const packageName = "packagename";
  const response = await fetchPackageDependantsListings(
    config,
    communityId,
    namespaceId,
    packageName
  );

  expect(typeof response.count).toEqual("number");
  expect(Array.isArray(response.results)).toEqual(true);

  response.results.forEach((pkg: PartialPackage) => {
    expect(pkg.community_identifier.toLowerCase()).toStrictEqual(communityId);
  });
});
