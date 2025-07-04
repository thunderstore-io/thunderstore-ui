import { config, testData } from "../../__tests__/defaultConfig";
import { fetchTeamServiceAccounts } from "../teamServiceAccounts";

it("ensures accessing team members requires authentication", async () => {
  await expect(
    fetchTeamServiceAccounts({
      config,
      params: { team_name: testData.namespaceId },
      data: {},
      queryParams: {},
    })
  ).rejects.toThrowError("401: Unauthorized");
});
