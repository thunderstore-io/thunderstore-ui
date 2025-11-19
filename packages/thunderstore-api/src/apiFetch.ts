import {
  ApiError,
  ParseError,
  RequestConfig,
  RequestBodyParseError,
  RequestQueryParamsParseError,
} from "./index";
import { z } from "zod";
import { serializeQueryString } from "./queryString";

const BASE_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const MAX_NB_RETRY = 5;
const RETRY_DELAY_MS = 200;

/**
 * Attempts a fetch call multiple times to work around transient network failures.
 */
async function fetchRetry(
  input: RequestInfo | URL,
  init?: RequestInit | undefined
) {
  let retryLeft = MAX_NB_RETRY;
  let latestErr = null;
  while (retryLeft > 0) {
    try {
      return await fetch(input, init);
    } catch (err) {
      latestErr = err;
      await sleep(RETRY_DELAY_MS);
    } finally {
      retryLeft -= 1;
    }
  }
  if (latestErr !== null) {
    throw latestErr;
  } else {
    throw new Error(`Too many retries`);
  }
}

/**
 * Simple timeout helper used by the retry loop.
 */
function sleep(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Arguments supplied to `apiFetch` describing the HTTP request and validation schemas.
 */
type SchemaOrUndefined<Schema extends z.ZodSchema | undefined> =
  Schema extends z.ZodSchema ? z.infer<Schema> : undefined;

export type apiFetchArgs<
  RequestSchema extends z.ZodSchema | undefined,
  QueryParamsSchema extends z.ZodSchema | undefined,
> = {
  config: () => RequestConfig;
  path: string;
  queryParams?: SchemaOrUndefined<QueryParamsSchema>;
  request?: Omit<RequestInit, "headers" | "body"> & { body?: string };
  useSession?: boolean;
  bodyRaw?: SchemaOrUndefined<RequestSchema>;
};

/**
 * Validates input payloads, executes the HTTP request, and parses the response with Zod schemas.
 */
export async function apiFetch<
  RequestSchema extends z.ZodSchema | undefined,
  QueryParamsSchema extends z.ZodSchema | undefined,
  ResponseSchema extends z.ZodSchema | undefined,
>(props: {
  args: apiFetchArgs<RequestSchema, QueryParamsSchema>;
  requestSchema: RequestSchema;
  queryParamsSchema: QueryParamsSchema;
  responseSchema: ResponseSchema;
}): Promise<SchemaOrUndefined<ResponseSchema>> {
  const { args, requestSchema, queryParamsSchema, responseSchema } = props;

  if (requestSchema && args.bodyRaw) {
    const parsedRequestBody = requestSchema.safeParse(args.bodyRaw);
    if (!parsedRequestBody.success) {
      throw new RequestBodyParseError(parsedRequestBody.error);
    }
  }

  if (queryParamsSchema && args.queryParams) {
    const parsedQueryParams = queryParamsSchema.safeParse(args.queryParams);
    if (!parsedQueryParams.success) {
      throw new RequestQueryParamsParseError(parsedQueryParams.error);
    }
  }

  const { config, path, request, queryParams, useSession = false } = args;
  const configSnapshot = config();
  const usedConfig: RequestConfig = useSession
    ? configSnapshot
    : {
        apiHost: configSnapshot.apiHost,
        sessionId: undefined,
      };
  const sessionWasUsed = Boolean(usedConfig.sessionId);
  const url = getUrl(usedConfig, path, queryParams);

  const response = await fetchRetry(url, {
    ...(request ?? {}),
    headers: {
      ...BASE_HEADERS,
      ...getAuthHeaders(usedConfig),
    },
  });

  if (!response.ok) {
    const apiError = await ApiError.createFromResponse(response, {
      sessionWasUsed,
    });
    throw apiError;
  }

  if (responseSchema === undefined) {
    return undefined as SchemaOrUndefined<ResponseSchema>;
  }

  const parsed = responseSchema.safeParse(await response.json());
  if (!parsed.success) {
    throw new ParseError(parsed.error);
  }

  return parsed.data;
}

/**
 * Derives authentication headers based on the provided request configuration.
 */
function getAuthHeaders(config: RequestConfig): RequestInit["headers"] {
  return config.sessionId
    ? {
        Authorization: `Session ${config.sessionId}`,
      }
    : {};
}

/**
 * Builds the request URL with optional query parameters.
 */
function getUrl(
  config: RequestConfig,
  path: string,
  queryParams?: { key: string; value: string; impotent?: string }[]
) {
  const fullPath = queryParams
    ? `${path}?${serializeQueryString(queryParams)}`
    : path;
  return new URL(fullPath, config.apiHost);
}
