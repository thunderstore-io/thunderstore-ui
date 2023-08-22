import { fetchCommunityList } from "../index";

it("finds RoR2 in community listing", async () => {
  const response = await fetchCommunityList();

  expect(Array.isArray(response.results)).toEqual(true);

  const ror = response.results.find(
    (x: { identifier: string }) => x.identifier === "riskofrain2"
  );

  expect(ror).toBeDefined();
});
