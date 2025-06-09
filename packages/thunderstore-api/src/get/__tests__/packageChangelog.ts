import { config, testData } from "../../__tests__/defaultConfig";
import { fetchPackageChangelog } from "../packageChangelog";

it("ensures CHANGELOG of a package can be rendered", async () => {
  const { namespaceId, packageName } = testData;
  const response = await fetchPackageChangelog({
    config,
    params: {
      namespace_id: namespaceId,
      package_name: packageName,
    },
    data: {},
    queryParams: {},
  });

  expect(typeof response.html).toEqual("string");
});
