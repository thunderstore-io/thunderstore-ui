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

export interface LoaderErrorMapping {
  status: number | readonly number[];
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

export function handleLoaderError(
  error: unknown,
  options: HandleLoaderErrorOptions = {}
): never {
  if (error instanceof Response) {
    throw error;
  }

  if (error instanceof ApiError && options.mappings?.length) {
    const mapping = options.mappings.find((candidate) => {
      const statuses = Array.isArray(candidate.status)
        ? candidate.status
        : [candidate.status];
      return statuses.includes(error.statusCode);
    });

    if (mapping) {
      const base = mapApiErrorToUserFacingError(error, options.mapOptions);
      const includeContextValue =
        mapping.includeContext ?? options.includeContext ?? false;
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
        statusOverride: mapping.statusOverride ?? options.statusOverride,
      });
    }
  }

  throwUserFacingErrorResponse(error, options);
}
