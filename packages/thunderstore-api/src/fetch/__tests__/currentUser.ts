import { fetchCurrentUser } from "../currentUser";

it("receives emptyish object when querying without session id", async () => {
  const config = { apiHost: "https://thunderstore.dev" };
  const response = await fetchCurrentUser(config);

  expect(response).toHaveProperty("username", null);
  expect(response).toHaveProperty("capabilities", []);
  expect(response).toHaveProperty("connections", []);
  expect(response).toHaveProperty("rated_packages", []);
  expect(response).toHaveProperty("subscription", { expires: null });
  expect(response).toHaveProperty("teams", []);
});
