import { config, testData } from "./defaultConfig";
import { fetchNamespacePackageListings } from "../namespacePackageListings";

interface PartialPackage {
  community_identifier: string;
  namespace: string;
}

it("receives namespace scoped paginated package listing", async () => {
  const { communityId, namespaceId } = testData;
  const response = await fetchNamespacePackageListings(
    config,
    communityId,
    namespaceId
  );

  expect(typeof response.count).toEqual("number");
  expect(Array.isArray(response.results)).toEqual(true);

  response.results.forEach((pkg: PartialPackage) => {
    expect(pkg.community_identifier).toStrictEqual(communityId);
    expect(pkg.namespace).toStrictEqual(namespaceId);
  });
});
