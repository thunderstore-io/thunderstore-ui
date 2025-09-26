import { it, expect } from "vitest";
import { config, testData } from "../../__tests__/defaultConfig";
import { fetchPackageListingDetails } from "../packageListingDetails";

it("ensures a package is listed in a community", async () => {
  const { communityId, namespaceId, packageName } = testData;
  const response = await fetchPackageListingDetails({
    config,
    params: {
      community_id: communityId,
      namespace_id: namespaceId,
      package_name: packageName,
    },
    data: {},
    queryParams: {},
  });

  expect(response.community_identifier).toEqual(communityId);
  expect(response.namespace).toEqual(namespaceId);
  expect(response.name).toEqual(packageName);
});
