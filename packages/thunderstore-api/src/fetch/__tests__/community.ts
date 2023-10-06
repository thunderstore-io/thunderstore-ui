import { fetchCommunity } from "../community";

it("ensures RoR2 community exists", async () => {
  const config = { apiHost: "https://thunderstore.dev" };
  const response = await fetchCommunity(config, "riskofrain2");

  expect(response.identifier).toStrictEqual("riskofrain2");
  expect(typeof response.name).toStrictEqual("string");
});
