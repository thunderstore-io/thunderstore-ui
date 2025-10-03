import { config, testData } from "../../__tests__/defaultConfig";
import { fetchNamespacePackageListings } from "../namespacePackageListings";
import { PackageListingsOrderingEnum } from "../../schemas/queryParamSchemas";
import { it, expect } from "vitest";

interface PartialPackage {
  community_identifier: string;
  namespace: string;
}

it("receives namespace scoped paginated package listing", async () => {
  const { communityId, namespaceId } = testData;
  const response = await fetchNamespacePackageListings({
    config,
    params: { community_id: communityId, namespace_id: namespaceId },
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
    expect(pkg.community_identifier).toStrictEqual(communityId);
    expect(pkg.namespace).toStrictEqual(namespaceId);
  });
});
