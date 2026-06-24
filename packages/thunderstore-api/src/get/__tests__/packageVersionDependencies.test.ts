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

test("accepts dependencies whose icon_url is null", () => {
  // Regression: the API returns icon_url: null for iconless/deactivated
  // dependencies, which previously threw ParseError on this endpoint.
  const response = {
    count: 1,
    next: null,
    previous: null,
    results: [
      {
        description: "A dependency without an icon",
        icon_url: null,
        is_active: false,
        name: "SomePackage",
        namespace: "SomeTeam",
        version_number: "1.2.3",
        is_removed: false,
      },
    ],
  };

  const parsed = packageVersionDependenciesResponseDataSchema.parse(response);
  expect(parsed.results[0].icon_url).toBeNull();
});
