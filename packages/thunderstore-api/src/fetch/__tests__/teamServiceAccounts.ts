import { config } from "./defaultConfig";
import { fetchTeamServiceAccounts } from "../teamServiceAccounts";

it("ensures accessing team members requires authentication", async () => {
  await expect(
    fetchTeamServiceAccounts(config, "TestTeam")
  ).rejects.toThrowError("401: Unauthorized");
});
