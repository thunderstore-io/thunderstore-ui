import { it, expect } from "vitest";
import { config, testData } from "../../__tests__/defaultConfig";
import { fetchTeamDetails } from "../teamDetails";

it("ensures team exists", async () => {
  const response = await fetchTeamDetails({
    config,
    params: { team_name: testData.namespaceId },
    data: {},
    queryParams: {},
  });

  expect(typeof response.identifier).toStrictEqual("number");
  expect(response.name).toStrictEqual(testData.namespaceId);
});
