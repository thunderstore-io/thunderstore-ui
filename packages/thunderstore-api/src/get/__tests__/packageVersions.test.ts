import { expect, it } from "vitest";
import { config, testData } from "../../__tests__/defaultConfig";
import { fetchPackageVersions } from "../packageVersions";

it("ensures package version listings can be fetched", async () => {
  const { namespaceId, packageName } = testData;
  const response = await fetchPackageVersions({
    config,
    params: { namespace_id: namespaceId, package_name: packageName },
    data: {},
    queryParams: {},
  });

  expect(Array.isArray(response)).toEqual(true);
});
