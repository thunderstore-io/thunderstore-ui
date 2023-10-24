import { config } from "./defaultConfig";
import { fetchTeamDetails } from "../teamDetails";

it("ensures team exists", async () => {
  const response = await fetchTeamDetails(config, "testteam");

  expect(typeof response.identifier).toStrictEqual("number");
  expect(response.name).toStrictEqual("TestTeam");
});
