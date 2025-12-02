import {
  ApiError,
  type UserFacingErrorCategory,
  mapApiErrorToUserFacingError,
} from "@thunderstore/thunderstore-api";

import { defaultErrorMappings } from "./loaderMappings";
import {
  type CreateUserFacingErrorResponseOptions,
  type UserFacingErrorPayload,
  throwUserFacingErrorResponse,
  throwUserFacingPayloadResponse,
} from "./userFacingErrorResponse";

export interface LoaderErrorMapping {
  status: number;
  headline: string;
  description?: string;
  category?: UserFacingErrorCategory;
  includeContext?: boolean;
  statusOverride?: number;
}

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
      return statuses.includes(error.response.status);
    });

    if (mapping) {
      const base = mapApiErrorToUserFacingError(
        error,
        resolvedOptions.mapOptions
      );
      const payload: UserFacingErrorPayload = {
        headline: mapping.headline,
        description: mapping.description ?? base.description,
        category: mapping.category ?? base.category,
        status: mapping.statusOverride ?? base.status,
      };

      payload.context =
        base.context &&
        (mapping.includeContext ?? resolvedOptions.includeContext ?? false)
          ? base.context
          : undefined;

      throwUserFacingPayloadResponse(payload, {
        statusOverride:
          mapping.statusOverride ?? resolvedOptions.statusOverride,
      });
    }
  }

  throwUserFacingErrorResponse(error, resolvedOptions);
}
