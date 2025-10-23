import { isRouteErrorResponse } from "react-router";
import {
  ApiError,
  mapApiErrorToUserFacingError,
  type UserFacingError,
} from "@thunderstore/thunderstore-api";
import {
  parseUserFacingErrorPayload,
  type UserFacingErrorPayload,
} from "./userFacingErrorResponse";

/**
 * Converts a domain user-facing error into the serialisable payload shape.
 */
function toPayloadFromUserFacing(
  error: UserFacingError
): UserFacingErrorPayload {
  return {
    headline: error.headline,
    description: error.description,
    category: error.category,
    status: error.status,
    context: error.context,
  };
}

/**
 * Normalizes various error shapes thrown during routing into a consistent payload
 * that components can render without duplicating mapping logic.
 */
export function resolveRouteErrorPayload(
  error: unknown
): UserFacingErrorPayload {
  if (isRouteErrorResponse(error)) {
    const parsed = parseUserFacingErrorPayload(error.data);
    if (parsed) {
      return parsed;
    }

    return {
      headline: error.statusText || "Something went wrong.",
      description: typeof error.data === "string" ? error.data : undefined,
      category: "server",
      status: error.status,
    };
  }

  if (error instanceof ApiError) {
    return toPayloadFromUserFacing(mapApiErrorToUserFacingError(error));
  }

  const parsed = parseUserFacingErrorPayload(error);
  if (parsed) {
    return parsed;
  }

  if (error instanceof Error) {
    return {
      headline: error.message || "Something went wrong.",
      description: undefined,
      category: "server",
      status: 500,
    };
  }

  return {
    headline: "Something went wrong.",
    description: undefined,
    category: "server",
    status: 500,
  };
}
