import { expect, it } from "vitest";
import { config, testData } from "../../__tests__/defaultConfig";
import { fetchPackageVersionDependencies } from "../packageVersionDependencies";
import { packageVersionDependenciesResponseDataSchema } from "../..";

it("ensures package version dependencies can be fetched", async () => {
  const { namespaceId, packageName, versionNumber } = testData;
  const response = await fetchPackageVersionDependencies({
    config,
    params: {
      namespace_id: namespaceId,
      package_name: packageName,
      version_number: versionNumber,
    },
    data: {},
    queryParams: [{ key: "page", value: 1, impotent: 1 }],
  });

  expect(response.count).toBe(3);
  expect(response.results.length).toBe(3);
  expect(packageVersionDependenciesResponseDataSchema.parse(response)).toEqual(
    response
  );
});
