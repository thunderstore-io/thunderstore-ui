import { config, testData } from "./defaultConfig";
import { fetchTeamMembers } from "../teamMembers";

it("ensures accessing team members requires authentication", async () => {
  await expect(
    fetchTeamMembers(config, testData.namespaceId)
  ).rejects.toThrowError("401: Unauthorized");
});
