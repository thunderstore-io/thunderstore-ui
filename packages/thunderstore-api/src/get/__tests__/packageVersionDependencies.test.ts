import { expect, test } from "vitest";

import { packageVersionDependenciesResponseDataSchema } from "../..";
import { config, testData } from "../../__tests__/defaultConfig";
import { fetchPackageVersionDependencies } from "../packageVersionDependencies";

// TODO: Disabled temporarily until we decide on a testing strategy/policy regarding e2e tests
test.skip("ensures package version dependencies can be fetched", async () => {
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
