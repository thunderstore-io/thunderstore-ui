import { config, testData } from "./defaultConfig";
import { fetchPackageVersions } from "../packageVersions";

it("ensures package version listings can be fetched", async () => {
  const { namespaceId, packageName } = testData;
  const response = await fetchPackageVersions(config, namespaceId, packageName);

  expect(Array.isArray(response)).toEqual(true);
});
