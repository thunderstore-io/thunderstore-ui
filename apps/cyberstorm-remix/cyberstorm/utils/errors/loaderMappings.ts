import type { LoaderErrorMapping } from "./handleLoaderError";

export const SIGN_IN_REQUIRED_MAPPING: LoaderErrorMapping = {
  status: 401,
  headline: "Sign in required.",
  description: "Please sign in to continue.",
  category: "auth",
};

export const FORBIDDEN_MAPPING: LoaderErrorMapping = {
  status: 403,
  headline: "You do not have permission to perform this action.",
  description: "Contact a team administrator to request access.",
  category: "auth",
};

export const VALIDATION_MAPPING: LoaderErrorMapping = {
  status: 422,
  headline: "Invalid request.",
  description: "Please review the provided data and try again.",
  category: "validation",
};

export const CONFLICT_MAPPING: LoaderErrorMapping = {
  status: 409,
  headline: "Action could not be completed.",
  description:
    "Another change was made at the same time. Refresh and try again.",
  category: "server",
};

export const RATE_LIMIT_MAPPING: LoaderErrorMapping = {
  status: 429,
  headline: "Too many requests.",
  description: "Please wait a moment and try again.",
  category: "rate_limit",
};

/**
 * Creates a reusable server-error mapping with configurable copy and status.
 */
export function createServerErrorMapping(
  headline = "Something went wrong.",
  description = "Please try again in a moment.",
  status = 500
): LoaderErrorMapping {
  return {
    status,
    headline,
    description,
    category: "server",
  };
}

/**
 * Creates a not-found mapping for loader routes that present custom messaging.
 */
export function createNotFoundMapping(
  headline: string,
  description: string,
  status = 404
): LoaderErrorMapping {
  return {
    status,
    headline,
    description,
    category: "not_found",
  };
}

export const defaultErrorMappings: LoaderErrorMapping[] = [
  SIGN_IN_REQUIRED_MAPPING,
  FORBIDDEN_MAPPING,
  VALIDATION_MAPPING,
  createServerErrorMapping(),
  createNotFoundMapping(
    "Resource not found.",
    "We could not find the requested resource.",
    404
  ),
];
