import { config } from "./defaultConfig";
import { fetchNamespacePackageListings } from "../namespacePackageListings";

interface PartialPackage {
  community_identifier: string;
  namespace: string;
}

it("receives namespace scoped paginated package listing", async () => {
  const communityId = "riskofrain2";
  const namespaceId = "testteam";
  const response = await fetchNamespacePackageListings(
    config,
    communityId,
    namespaceId
  );

  expect(typeof response.count).toEqual("number");
  expect(Array.isArray(response.results)).toEqual(true);

  response.results.forEach((pkg: PartialPackage) => {
    expect(pkg.community_identifier.toLowerCase()).toStrictEqual(communityId);
    expect(pkg.namespace.toLowerCase()).toStrictEqual(namespaceId);
  });
});
