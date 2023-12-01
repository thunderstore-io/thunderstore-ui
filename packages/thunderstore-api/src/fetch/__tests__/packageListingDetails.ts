import { config } from "./defaultConfig";
import { fetchPackageListingDetails } from "../packageListingDetails";

it("ensures default package is listed in default community", async () => {
  const communityId = "riskofrain2";
  const namespaceId = "testteam";
  const packageName = "packagename";
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
