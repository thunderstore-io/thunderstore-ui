import { fetchCurrentUser } from "@thunderstore/thunderstore-api";

import { DapperTsInterface } from "../index";

export async function getCurrentUser(this: DapperTsInterface) {
  const data = await fetchCurrentUser({
    config: this.config,
    params: {},
    data: {},
    queryParams: {},
  });

  if (data.username === null) {
    this.removeSessionHook?.();
  }

  return data;
}
