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

const DEFAULT_HEADLINE = "Something went wrong.";
const DEFAULT_DESCRIPTION = "Please try again.";

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
    const category = categorizeStatus(error.statusCode);
    const headline = ensureHeadline(error.message, fallbackHeadline);
    const sanitizedServerDetail = ensureDescription(error.serverMessage ?? "");
    const sanitizedFallback = ensureDescription(fallbackDescription);
    const descriptionCandidate = sanitizedServerDetail || sanitizedFallback;

    return new UserFacingError({
      category,
      status: error.statusCode,
      headline,
      description: descriptionCandidate,
      originalError: error,
      context: {
        ...options.context,
        statusText: error.statusText,
        sessionWasUsed: error.context?.sessionWasUsed ?? false,
      },
    });
  }

  if (
    error instanceof RequestBodyParseError ||
    error instanceof RequestQueryParamsParseError ||
    error instanceof ParseError
  ) {
    const message = ensureHeadline(error.message, "Invalid request data.");
    return new UserFacingError({
      category: "validation",
      headline: message,
      description: sanitizeServerDetail(error.message),
      originalError: error,
      context: options.context,
    });
  }

  if (isNetworkError(error)) {
    const err = toError(error);
    return new UserFacingError({
      category: "network",
      headline: fallbackHeadline,
      description: fallbackDescription,
      originalError: err,
      context: options.context,
    });
  }

  const err = toError(error);
  return new UserFacingError({
    category: "unknown",
    headline: fallbackHeadline,
    description: fallbackDescription,
    originalError: err,
    context: options.context,
  });
}

function ensureHeadline(value: string, fallback: string): string {
  const sanitized = sanitizeServerDetail(value);
  return sanitized || fallback;
}

function ensureDescription(value: string): string {
  return sanitizeServerDetail(value);
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
  if (error instanceof TypeError) {
    return true;
  }
  if (error instanceof Error && error.name === "AbortError") {
    return true;
  }
  return false;
}

function toError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error(String(error));
}
