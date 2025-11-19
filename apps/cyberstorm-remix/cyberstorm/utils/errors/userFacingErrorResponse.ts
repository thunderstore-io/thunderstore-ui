import {
  type MapUserFacingErrorOptions,
  type UserFacingError,
  type UserFacingErrorCategory,
  mapApiErrorToUserFacingError,
} from "@thunderstore/thunderstore-api";

/**
 * Serializable data presented to users when API or loader errors occur.
 */
export interface UserFacingErrorPayload {
  headline: string;
  description?: string;
  category: UserFacingErrorCategory;
  status?: number;
  context?: Record<string, unknown>;
}

/**
 * Controls how auxiliary context is included when mapping errors.
 */
export interface UserFacingPayloadOptions {
  includeContext?: boolean;
}

/**
 * Configuration for constructing standardised user-facing error responses.
 */
export interface CreateUserFacingErrorResponseOptions {
  mapOptions?: MapUserFacingErrorOptions;
  statusOverride?: number;
  includeContext?: boolean;
}

/**
 * Throws a Remix `Response` with a serialised user-facing error payload.
 */
export function throwUserFacingErrorResponse(
  error: unknown,
  options: CreateUserFacingErrorResponseOptions = {}
): never {
  const userFacing = mapApiErrorToUserFacingError(error, options.mapOptions);
  const payload = toPayload(userFacing, {
    includeContext: options.includeContext ?? false,
  });

  throwUserFacingPayloadResponse(payload, {
    statusOverride: options.statusOverride,
  });
}

/**
 * Throws a Remix `Response` for an already-created user-facing error payload.
 */
export function throwUserFacingPayloadResponse(
  payload: UserFacingErrorPayload,
  options: { statusOverride?: number } = {}
): never {
  const status = options.statusOverride ?? payload.status ?? 500;
  throw new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

/**
 * Attempts to parse a user-facing payload from unknown data.
 */
export function parseUserFacingErrorPayload(
  value: unknown
): UserFacingErrorPayload | null {
  if (isUserFacingErrorPayload(value)) {
    return value;
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (isUserFacingErrorPayload(parsed)) {
        return parsed;
      }
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Runtime type guard for `UserFacingErrorPayload` values.
 */
export function isUserFacingErrorPayload(
  value: unknown
): value is UserFacingErrorPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const maybePayload = value as Partial<UserFacingErrorPayload>;
  return (
    typeof maybePayload.headline === "string" &&
    typeof maybePayload.category === "string"
  );
}

/**
 * Internal helper that filters context inclusion for payload serialisation.
 */
function toPayload(
  error: UserFacingError,
  options: UserFacingPayloadOptions = {}
): UserFacingErrorPayload {
  const includeContext = options.includeContext ?? false;

  const payload: UserFacingErrorPayload = {
    headline: error.headline,
    description: error.description,
    category: error.category,
    status: error.status,
  };

  if (includeContext && error.context) {
    payload.context = error.context;
  }

  return payload;
}
