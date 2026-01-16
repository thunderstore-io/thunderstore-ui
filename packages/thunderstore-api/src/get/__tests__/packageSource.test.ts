import { expect, test } from "vitest";

import { config, testData } from "../../__tests__/defaultConfig";
import { packageSourceResponseDataSchema } from "../../schemas/responseSchemas";
import { fetchPackageSource } from "../packageSource";

test("ensures package source endpoint works when enabled (or 404 when disabled)", async () => {
  const { namespaceId, packageName } = testData;

  try {
    const response = await fetchPackageSource({
      config,
      params: {
        namespace_id: namespaceId,
        package_name: packageName,
      },
      data: {},
      queryParams: {},
    });

    expect(packageSourceResponseDataSchema.parse(response)).toEqual(response);
    expect(Array.isArray(response.decompilations)).toBe(true);
  } catch (err) {
    // The container test backend may not include the plugin that registers this endpoint.
    // Treat a 404 as "endpoint disabled".
    if (err instanceof Error && err.message.includes("404")) {
      return;
    }

    throw err;
  }
});
