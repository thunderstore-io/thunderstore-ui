import { expect, test } from "vitest";

import { packageVersionDependenciesResponseDataSchema } from "../..";
import { config, testData } from "../../__tests__/defaultConfig";
import { fetchPackageVersionDependencies } from "../packageVersionDependencies";

test("ensures package version dependencies can be fetched", async () => {
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

  expect(packageVersionDependenciesResponseDataSchema.parse(response)).toEqual(
    response
  );
  expect(response.count).toBeTypeOf("number");
  expect(Array.isArray(response.results)).toBe(true);
});
