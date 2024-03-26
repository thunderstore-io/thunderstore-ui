import { config } from "./defaultConfig";
import { fetchCurrentUser } from "../currentUser";

it("receives emptyish object when querying without session id", async () => {
  const response = await fetchCurrentUser(config);

  expect(response).toHaveProperty("username", null);
  expect(response).toHaveProperty("capabilities", []);
  expect(response).toHaveProperty("connections", []);
  expect(response).toHaveProperty("rated_packages", []);
  expect(response).toHaveProperty("rated_packages_cyberstorm", []);
  expect(response).toHaveProperty("subscription", { expires: null });
  expect(response).toHaveProperty("teams", []);
});
