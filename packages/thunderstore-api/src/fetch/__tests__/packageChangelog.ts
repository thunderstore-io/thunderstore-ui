import { config, testData } from "./defaultConfig";
import { fetchPackageChangelog } from "../packageChangelog";

it("ensures CHANGELOG of the default package can be rendered", async () => {
  const { namespaceId, packageName } = testData;
  const response = await fetchPackageChangelog(
    config,
    namespaceId,
    packageName
  );

  expect(typeof response.html).toEqual("string");
});
