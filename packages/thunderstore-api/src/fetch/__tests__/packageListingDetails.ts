import { config, testData } from "./defaultConfig";
import { fetchPackageListingDetails } from "../packageListingDetails";

it("ensures default package is listed in default community", async () => {
  const { communityId, namespaceId, packageName } = testData;
  const response = await fetchPackageListingDetails(
    config,
    communityId,
    namespaceId,
    packageName
  );

  expect(response.community_identifier).toEqual(communityId);
  expect(response.namespace).toEqual(namespaceId);
  expect(response.name).toEqual(packageName);
});
