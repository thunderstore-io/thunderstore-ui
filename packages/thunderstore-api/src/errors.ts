import { z } from "zod";
import { formatErrorMessage } from "./utils";

type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | JSONValue[];

type ApiErrorContext = {
  sessionWasUsed?: boolean;
};

const HTTP_STATUS_TITLES: Record<number, string> = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
  422: "Unprocessable Entity",
  429: "Too Many Requests",
  500: "Internal Server Error",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
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

  constructor(args: {
    message: string;
    response: Response;
    responseJson?: JSONValue;
  }) {
    super(args.message);
    this.responseJson = args.responseJson;
    this.response = args.response;
  }

  static async createFromResponse(
    response: Response,
    context: ApiErrorContext = {}
  ): Promise<ApiError> {
    let responseJson: JSONValue | undefined;
    try {
      responseJson = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      responseJson = undefined;
    }

    return new ApiError({
      message: buildApiErrorMessage({ response, responseJson, context }),
      response: response,
      responseJson: responseJson,
    });
  }

  getFieldErrors(): { [key: string | "root"]: string[] } {
    if (typeof this.responseJson !== "object")
      return { root: ["Unknown error occurred"] };
    if (Array.isArray(this.responseJson)) {
      return {
        root: this.responseJson.map((x) => x.toString()),
      };
    } else {
      return Object.fromEntries(
        Object.entries(this.responseJson).map(([key, val]) => {
          return [
            key,
            Array.isArray(val)
              ? val.map((x) => x.toString())
              : [val.toString()],
          ];
        })
      );
    }
  }
}

export class RequestBodyParseError extends Error {
  constructor(public error: z.ZodError) {
    super(formatErrorMessage(error));
  }
}

export class RequestQueryParamsParseError extends Error {
  constructor(public error: z.ZodError) {
    super(formatErrorMessage(error));
  }
}

export class ParseError extends Error {
  constructor(public error: z.ZodError) {
    super(formatErrorMessage(error));
  }
}

function buildApiErrorMessage(args: {
  response: Response;
  responseJson?: JSONValue;
  context: ApiErrorContext;
}): string {
  const { response, responseJson, context } = args;
  const statusLabel = getStatusLabel(response);
  const baseMessage = getBaseMessage(response.status, context);
  const detailMessage = extractMessage(responseJson);

  const parts: string[] = [];

  if (baseMessage) {
    parts.push(baseMessage);
  }

  if (
    detailMessage &&
    (!baseMessage ||
      detailMessage.toLowerCase().trim() !== baseMessage.toLowerCase().trim())
  ) {
    if (parts.length > 0) {
      const lastIndex = parts.length - 1;
      const trimmed = parts[lastIndex].trim();
      const needsSeparator = !/[.!?:]$/.test(trimmed);
      parts[lastIndex] = needsSeparator ? `${trimmed}:` : trimmed;
    }
    parts.push(detailMessage);
  }

  const messageBody = parts.join(" ").trim();

  if (messageBody.length > 0) {
    return `${messageBody} (${statusLabel})`;
  }

  return statusLabel;
}

function getBaseMessage(
  status: number,
  context: ApiErrorContext
): string | undefined {
  if (status === 401) {
    if (context.sessionWasUsed) {
      return "Your session has expired. Please sign in again.";
    }
    return "Authentication required. Please sign in.";
  }

  switch (status) {
    case 400:
      return "The request is invalid. Please review the provided data.";
    case 403:
      return "You do not have permission to perform this action.";
    case 404:
      return "The requested resource was not found.";
    case 409:
      return "The request conflicts with the current state.";
    case 422:
      return "The server could not process the request due to validation errors.";
    case 429:
      return "Too many requests were sent in a short time.";
    default:
      if (status >= 500 && status < 600) {
        return "The server encountered an unexpected error. Please try again later.";
      }
  }

  return undefined;
}

function extractMessage(value: JSONValue | undefined): string | undefined {
  if (value === undefined || value === null) return undefined;

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    const parts = value
      .map((item) => extractMessage(item))
      .filter((item): item is string => Boolean(item));

    if (parts.length > 0) {
      return parts.join(" ");
    }

    return undefined;
  }

  const objectValue = value as { [x: string]: JSONValue };

  for (const key of JSON_MESSAGE_PRIORITY_KEYS) {
    if (key in objectValue) {
      const message = extractMessage(objectValue[key]);
      if (message) {
        return message;
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
  const fallback = HTTP_STATUS_TITLES[response.status] ?? "Error";
  const statusText = response.statusText?.trim() || fallback;
  return `${response.status} ${statusText}`.trim();
}
