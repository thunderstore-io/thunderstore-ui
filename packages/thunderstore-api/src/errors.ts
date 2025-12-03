import { z } from "zod";

import { sanitizeServerDetail } from "./errors/sanitizeServerDetail";
import { formatErrorMessage } from "./utils";

type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | JSONValue[]
  | null;

type ApiErrorContext = {
  sessionWasUsed?: boolean;
};

const JSON_MESSAGE_PRIORITY_KEYS = [
  "detail",
  "message",
  "error",
  "errors",
  "non_field_errors",
  "root",
  "__all__",
  "title",
];

export function isApiError(e: Error | ApiError | unknown): e is ApiError {
  return e instanceof ApiError;
}

export class ApiError extends Error {
  response: Response;
  responseJson?: JSONValue;
  responseText?: string;
  context?: ApiErrorContext;
  responseSummary?: string;

  constructor(args: {
    message: string;
    response: Response;
    responseJson?: JSONValue;
    responseText?: string;
    context?: ApiErrorContext;
    responseSummary?: string;
  }) {
    super(args.message);
    this.responseJson = args.responseJson;
    this.response = args.response;
    this.responseText = args.responseText;
    this.context = args.context;
    this.responseSummary = args.responseSummary;
  }

  static async createFromResponse(
    response: Response,
    context: ApiErrorContext = {}
  ): Promise<ApiError> {
    let responseText: string | undefined;
    let responseJson: JSONValue | undefined;
    try {
      responseText = await response.clone().text();
    } catch {
      responseText = undefined;
    }
    try {
      responseJson = responseText
        ? JSON.parse(responseText)
        : await response.json();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      responseJson = undefined;
    }

    const responseSummary = extractMessage(responseJson ?? responseText);

    return new ApiError({
      message: buildApiErrorMessage({ response, responseJson }),
      response: response,
      responseJson: responseJson,
      responseText,
      context,
      responseSummary,
    });
  }

  getFieldErrors(): { [key: string | "root"]: string[] } {
    if (!this.responseJson || typeof this.responseJson !== "object")
      return { root: ["Unknown error occurred"] };
    if (Array.isArray(this.responseJson)) {
      return {
        root: this.responseJson.map((x) => String(x)),
      };
    } else {
      return Object.fromEntries(
        Object.entries(this.responseJson).map(([key, val]) => {
          return [
            key,
            Array.isArray(val) ? val.map((x) => String(x)) : [String(val)],
          ];
        })
      );
    }
  }

  get statusCode(): number {
    return this.response.status;
  }

  get statusText(): string {
    return this.response.statusText;
  }
}

/**
 * Raised when a request body fails validation against its Zod schema.
 */
export class RequestBodyParseError extends Error {
  constructor(public error: z.ZodError) {
    super(formatErrorMessage(error));
  }
}

/**
 * Raised when query parameters fail validation against their Zod schema.
 */
export class RequestQueryParamsParseError extends Error {
  constructor(public error: z.ZodError) {
    super(formatErrorMessage(error));
  }
}

/**
 * Raised when response payloads fail validation against their expected Zod schema.
 */
export class ParseError extends Error {
  constructor(public error: z.ZodError) {
    super(formatErrorMessage(error));
  }
}

function buildApiErrorMessage(args: {
  response: Response;
  responseJson?: JSONValue;
}): string {
  const { response, responseJson } = args;
  const statusLabel = getStatusLabel(response);
  const detailMessage = extractMessage(responseJson);

  if (detailMessage) {
    return `${detailMessage} (${statusLabel})`;
  }

  return statusLabel;
}

function extractMessage(value: JSONValue | undefined): string | undefined {
  if (value === undefined || value === null) return undefined;

  if (typeof value === "string") {
    return sanitizeServerDetail(value);
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return sanitizeServerDetail(String(value));
  }

  if (Array.isArray(value)) {
    const parts = value
      .map((item) => extractMessage(item))
      .filter((item): item is string => Boolean(item));

    if (parts.length > 0) {
      return sanitizeServerDetail(parts.join(" "));
    }

    return undefined;
  }

  const objectValue = value as { [x: string]: JSONValue };

  for (const key of JSON_MESSAGE_PRIORITY_KEYS) {
    if (key in objectValue) {
      const message = extractMessage(objectValue[key]);
      if (message) {
        return sanitizeServerDetail(message);
      }
    }
  }

  for (const entry of Object.values(objectValue)) {
    const message = extractMessage(entry);
    if (message) {
      return message;
    }
  }

  return undefined;
}

function getStatusLabel(response: Response): string {
  const statusText = response.statusText?.trim() || "Error";
  return `${response.status} ${statusText}`.trim();
}
