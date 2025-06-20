import { config, testData } from "../../__tests__/defaultConfig";
import { fetchTeamMembers } from "../teamMembers";

it("ensures accessing team members requires authentication", async () => {
  await expect(
    fetchTeamMembers({
      config,
      params: { team_name: testData.namespaceId },
      data: {},
      queryParams: {},
    })
  ).rejects.toThrowError("401: Unauthorized");
});
