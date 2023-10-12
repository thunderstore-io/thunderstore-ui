import { config } from "./defaultConfig";
import { fetchTeamMembers } from "../teamMembers";

it("ensures accessing team members requires authentication", async () => {
  await expect(fetchTeamMembers(config, "TestTeam")).rejects.toThrowError(
    "401: Unauthorized"
  );
});
