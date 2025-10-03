import { it, expect } from "vitest";
import { config } from "../../__tests__/defaultConfig";
import { fetchCurrentUser } from "../currentUser";

it("receives emptyish object when querying without session id", async () => {
  const response = await fetchCurrentUser({
    config,
    params: {},
    data: {},
    queryParams: {},
  });
  expect(response).toHaveProperty("username", null);
  expect(response).toHaveProperty("capabilities", []);
  expect(response).toHaveProperty("connections", []);
  expect(response).toHaveProperty("subscription", { expires: null });
  expect(response).toHaveProperty("teams", []);
});
