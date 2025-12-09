import {
  ApiError,
  fetchCurrentUser,
  fetchCurrentUserTeamPermissions,
} from "@thunderstore/thunderstore-api";

import { DapperTsInterface } from "../index";

function isInvalidTokenError(error: ApiError): boolean {
  const detail = extractErrorDetail(error.responseJson);
  return (
    typeof detail === "string" && detail.toLowerCase().includes("invalid token")
  );
}

function extractErrorDetail(payload: unknown): string | undefined {
  if (!payload) {
    return undefined;
  }
  if (typeof payload === "string") {
    return payload;
  }
  if (
    typeof payload === "object" &&
    payload !== null &&
    "detail" in payload &&
    typeof (payload as { detail?: unknown }).detail === "string"
  ) {
    return (payload as { detail: string }).detail;
  }
  return undefined;
}

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
      if (isInvalidTokenError(error)) {
        // If the token is invalid, clear any persisted session data
        this.removeSessionHook?.();
      }
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
