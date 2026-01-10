import { z } from "zod";

interface SerializableResponse {
  headers: Record<string, string>;
  status: number;
  statusText: string;
  url: string;
}

type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | JSONValue[];

export function isApiError(e: Error | ApiError | unknown): e is ApiError {
  return e instanceof ApiError;
}

export class ApiError extends Error {
  response: SerializableResponse;
  responseJson?: JSONValue;

  constructor(args: {
    message: string;
    response: SerializableResponse;
    responseJson?: JSONValue;
  }) {
    super(args.message);
    this.responseJson = args.responseJson;
    this.response = args.response;
  }

  static async createFromResponse(response: Response): Promise<ApiError> {
    let responseJson: JSONValue | undefined;
    try {
      responseJson = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      responseJson = undefined;
    }

    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    return new ApiError({
      message: `${response.status}: ${response.statusText}`,
      response: {
        headers,
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      },
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
    super(error.message);
  }
}

export class RequestQueryParamsParseError extends Error {
  constructor(public error: z.ZodError) {
    super(error.message);
  }
}

export class ParseError extends Error {
  constructor(public error: z.ZodError) {
    super(error.message);
  }
}
