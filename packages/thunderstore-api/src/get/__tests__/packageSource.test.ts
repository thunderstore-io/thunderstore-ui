import { expect, test } from "vitest";
import { config, testData } from "../../__tests__/defaultConfig";
import { fetchPackageSource } from "../packageSource";
import { packageSourceResponseDataSchema } from "../../schemas/responseSchemas";

// TODO: Disabled temporarily until we decide on a testing strategy/policy regarding e2e tests
test.skip("ensures package source can be fetched", async () => {
  const { namespaceId, packageName } = testData;
  const response = await fetchPackageSource({
    config,
    params: {
      namespace_id: namespaceId,
      package_name: packageName,
    },
    data: {},
    queryParams: {},
  });

  expect(response.is_visible).toBe(true);
  expect(response.namespace).toBe(namespaceId);
  expect(response.package_name).toBe(packageName);
  expect(response.last_decompilation_date).toBeDefined();
  expect(response.decompilations.length).toBeGreaterThan(0);
  expect(packageSourceResponseDataSchema.parse(response)).toEqual(response);
});
