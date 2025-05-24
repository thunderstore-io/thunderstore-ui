import { config, testData } from "./defaultConfig";
import { fetchTeamDetails } from "../teamDetails";

it("ensures team exists", async () => {
  const response = await fetchTeamDetails(config, testData.namespaceId);

  expect(typeof response.identifier).toStrictEqual("number");
  expect(response.name).toStrictEqual(testData.namespaceId);
});
