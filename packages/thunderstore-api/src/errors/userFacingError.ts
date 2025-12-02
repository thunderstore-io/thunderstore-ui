import {
  ApiError,
  ParseError,
  RequestBodyParseError,
  RequestQueryParamsParseError,
} from "../errors";
import { sanitizeServerDetail } from "./sanitizeServerDetail";

export type UserFacingErrorCategory =
  | "auth"
  | "validation"
  | "not_found"
  | "rate_limit"
  | "server"
  | "network"
  | "unknown";

export interface MapUserFacingErrorOptions {
  fallbackHeadline?: string;
  fallbackDescription?: string;
  context?: Record<string, unknown>;
}

export interface CreateResourceNotFoundErrorArgs {
  resourceName: string;
  identifier?: string;
  description?: string;
  originalError: Error;
  context?: Record<string, unknown>;
}

interface UserFacingErrorArgs {
  category: UserFacingErrorCategory;
  status?: number;
  headline: string;
  description?: string;
  originalError: Error;
  context?: Record<string, unknown>;
}

export class UserFacingError extends Error {
  readonly category: UserFacingErrorCategory;
  readonly status?: number;
  readonly headline: string;
  readonly description?: string;
  readonly originalError: Error;
  readonly context?: Record<string, unknown>;

  constructor(args: UserFacingErrorArgs) {
    super(args.headline);
    this.category = args.category;
    this.status = args.status;
    this.headline = args.headline;
    this.description = args.description;
    this.originalError = args.originalError;
    this.context = args.context;
    this.name = "UserFacingError";
  }
}

const RESOURCE_FALLBACK_LABEL = "resource";

const DEFAULT_HEADLINE = "Something went wrong.";
const DEFAULT_DESCRIPTION = "Please try again.";

export interface FormatUserFacingErrorOptions {
  fallback?: string;
}

export function formatUserFacingError(
  error: UserFacingError,
  options: FormatUserFacingErrorOptions = {}
): string {
  if (error.description) {
    return `${error.headline} ${error.description}`;
  }
  if (options.fallback) {
    return options.fallback;
  }
  return error.headline;
}

export function mapApiErrorToUserFacingError(
  error: unknown,
  options: MapUserFacingErrorOptions = {}
): UserFacingError {
  if (error instanceof UserFacingError) {
    return error;
  }

  const fallbackHeadline = options.fallbackHeadline ?? DEFAULT_HEADLINE;
  const fallbackDescription =
    options.fallbackDescription ?? DEFAULT_DESCRIPTION;

  if (error instanceof ApiError) {
    const category = categorizeStatus(error.response.status);
    const headline = sanitizeServerDetail(error.message) ?? fallbackHeadline;
    const sanitizedServerDetail = sanitizeServerDetail(error.message ?? "");
    const sanitizedFallback = sanitizeServerDetail(fallbackDescription);
    const descriptionCandidate = sanitizedServerDetail || sanitizedFallback;

    return new UserFacingError({
      category,
      status: error.response.status,
      headline,
      description: descriptionCandidate,
      originalError: error,
      context: {
        ...options.context,
        statusText: error.response.statusText,
      },
    });
  }

  if (
    error instanceof RequestBodyParseError ||
    error instanceof RequestQueryParamsParseError ||
    error instanceof ParseError
  ) {
    const description = sanitizeServerDetail(error.message);
    return new UserFacingError({
      category: "validation",
      headline: "Invalid request data.",
      description: description || undefined,
      originalError: error,
      context: options.context,
    });
  }

  const err = new Error(String(error));

  if (isNetworkError(error)) {
    return new UserFacingError({
      category: "network",
      headline: fallbackHeadline,
      description: fallbackDescription,
      originalError: err,
      context: options.context,
    });
  }

  return new UserFacingError({
    category: "unknown",
    headline: fallbackHeadline,
    description: fallbackDescription,
    originalError: err,
    context: options.context,
  });
}

/**
 * Utility for generating consistent not-found errors with optional identifiers.
 */
export function createResourceNotFoundError(
  args: CreateResourceNotFoundErrorArgs
): UserFacingError {
  const resourceName =
    sanitizeServerDetail(args.resourceName) || RESOURCE_FALLBACK_LABEL;
  const identifier = args.identifier
    ? sanitizeServerDetail(args.identifier)
    : undefined;
  const headline = `${resourceName} not found.`;
  const description =
    (args.description ? sanitizeServerDetail(args.description) : undefined) ??
    (identifier
      ? `We could not find the ${resourceName} "${identifier}".`
      : `We could not find the requested ${resourceName}.`);

  return new UserFacingError({
    category: "not_found",
    status: 404,
    headline,
    description,
    originalError: args.originalError,
    context: {
      ...args.context,
      resource: resourceName,
      ...(identifier ? { identifier } : {}),
    },
  });
}

function categorizeStatus(status: number): UserFacingErrorCategory {
  if (status === 401 || status === 403) {
    return "auth";
  }
  if (status === 404) {
    return "not_found";
  }
  if (status === 422 || status === 400) {
    return "validation";
  }
  if (status === 429) {
    return "rate_limit";
  }
  if (status >= 500) {
    return "server";
  }
  return "unknown";
}

function isNetworkError(error: unknown): boolean {
  if (error instanceof Error && error.name === "AbortError") {
    return true;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    const message = (error as { message: string }).message;
    return (
      message === "Abort Error" ||
      message === "Network Error" ||
      message === "Failed to fetch" ||
      message === "fetch failed"
    );
  }

  return false;
}
