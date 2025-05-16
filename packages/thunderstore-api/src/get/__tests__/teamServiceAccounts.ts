import { config, testData } from "./defaultConfig";
import { fetchTeamServiceAccounts } from "../teamServiceAccounts";

it("ensures accessing team members requires authentication", async () => {
  await expect(
    fetchTeamServiceAccounts(config, testData.namespaceId)
  ).rejects.toThrowError("401: Unauthorized");
});
