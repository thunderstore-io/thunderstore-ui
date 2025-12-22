import {
  ApiError,
  fetchCurrentUser,
  fetchCurrentUserTeamPermissions,
} from "@thunderstore/thunderstore-api";

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
      // Any 401 means the session/auth context is invalid or stale.
      // Clear persisted session data to allow consumers to recover (e.g. re-auth).
      this.removeSessionHook?.();
      return null;
    }
    throw error;
  }
}

export async function getCurrentUserTeamPermissions(
  this: DapperTsInterface,
  teamName: string
) {
  return await fetchCurrentUserTeamPermissions({
    config: this.config,
    params: { team_name: teamName },
    data: {},
    queryParams: {},
  });
}
