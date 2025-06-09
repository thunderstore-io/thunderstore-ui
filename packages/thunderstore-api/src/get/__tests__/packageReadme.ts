import { config, testData } from "../../__tests__/defaultConfig";
import { fetchPackageReadme } from "../packageReadme";

it("ensures README of a package can be rendered", async () => {
  const { namespaceId, packageName } = testData;
  const response = await fetchPackageReadme({
    config,
    params: { namespace_id: namespaceId, package_name: packageName },
    data: {},
    queryParams: {},
  });

  expect(typeof response.html).toEqual("string");
});
