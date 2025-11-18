import { defaultErrorMappings } from "./loaderMappings";
import {
  throwUserFacingErrorResponse,
  throwUserFacingPayloadResponse,
  type CreateUserFacingErrorResponseOptions,
  type UserFacingErrorPayload,
} from "./userFacingErrorResponse";
import {
  ApiError,
  mapApiErrorToUserFacingError,
  type UserFacingErrorCategory,
} from "@thunderstore/thunderstore-api";

/**
 * Configuration describing how a specific HTTP status should be surfaced to the user.
 */
export interface LoaderErrorMapping {
  status: number | readonly number[];
  headline: string;
  description?: string;
  category?: UserFacingErrorCategory;
  includeContext?: boolean;
  statusOverride?: number;
}

/**
 * Options controlling how loader errors are mapped to user-facing responses.
 */
export interface HandleLoaderErrorOptions
  extends CreateUserFacingErrorResponseOptions {
  mappings?: LoaderErrorMapping[];
}

/**
 * Normalises unknown loader errors, promoting mapped API errors to user-facing payloads
 * and rethrowing everything else via `throwUserFacingErrorResponse`.
 */
export function handleLoaderError(
  error: unknown,
  options?: HandleLoaderErrorOptions
): never {
  if (error instanceof Response) {
    throw error;
  }

  const resolvedOptions: HandleLoaderErrorOptions = options ?? {};
  const allOptions = defaultErrorMappings.concat(
    resolvedOptions.mappings ?? []
  );

  if (error instanceof ApiError && allOptions.length) {
    const mapping = allOptions.findLast((candidate) => {
      const statuses = Array.isArray(candidate.status)
        ? candidate.status
        : [candidate.status];
      return statuses.includes(error.statusCode);
    });

    if (mapping) {
      const base = mapApiErrorToUserFacingError(
        error,
        resolvedOptions.mapOptions
      );
      const includeContextValue =
        mapping.includeContext ?? resolvedOptions.includeContext ?? false;
      const payload: UserFacingErrorPayload = {
        headline: mapping.headline,
        description:
          mapping.description !== undefined
            ? mapping.description
            : base.description,
        category: mapping.category ?? base.category,
        status: mapping.statusOverride ?? error.statusCode,
      };

      if (includeContextValue && base.context) {
        payload.context = base.context;
      }

      throwUserFacingPayloadResponse(payload, {
        statusOverride:
          mapping.statusOverride ?? resolvedOptions.statusOverride,
      });
    }
  }

  throwUserFacingErrorResponse(error, resolvedOptions);
}
