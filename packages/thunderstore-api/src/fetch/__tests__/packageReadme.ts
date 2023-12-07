import { config, testData } from "./defaultConfig";
import { fetchPackageReadme } from "../packageReadme";

it("ensures README of the default package can be rendered", async () => {
  const { namespaceId, packageName } = testData;
  const response = await fetchPackageReadme(config, namespaceId, packageName);

  expect(typeof response.html).toEqual("string");
});
