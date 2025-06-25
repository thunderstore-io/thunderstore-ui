import { ApiError, fetchCurrentUser } from "@thunderstore/thunderstore-api";

import { DapperTsInterface } from "../index";

export async function getCurrentUser(this: DapperTsInterface) {
  try {
    const data = await fetchCurrentUser({
      config: this.config,
      params: {},
      data: {},
      queryParams: {},
    });
    return data;
  } catch (error) {
    if (error instanceof ApiError && error.response.status === 401) {
      // If the user is not authenticated, we remove the session hook
      this.removeSessionHook?.();
      return null;
    } else {
      // If it's another error, we throw it
      throw error;
    }
  }
}
