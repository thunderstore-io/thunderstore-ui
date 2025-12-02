import { z } from "zod";

import {
  ApiError,
  ParseError,
  RequestBodyParseError,
  type RequestConfig,
  RequestQueryParamsParseError,
} from "./index";
import { serializeQueryString } from "./queryString";

const BASE_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const MAX_NB_RETRY = 5;
const RETRY_DELAY_MS = 200;

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

function sleep(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

type SchemaOrUndefined<Schema extends z.ZodSchema | undefined> =
  Schema extends z.ZodSchema ? z.infer<Schema> : undefined;

type apiFetchArgs<
  RequestSchema extends z.ZodSchema | undefined,
  QueryParamsSchema extends z.ZodSchema | undefined,
  ResponseSchema extends z.ZodSchema | undefined,
> = {
  config: () => RequestConfig;
  path: string;
  queryParams?: SchemaOrUndefined<QueryParamsSchema>;
  request?: Omit<RequestInit, "headers" | "body"> & { body?: string };
  useSession?: boolean;
  bodyRaw?: SchemaOrUndefined<RequestSchema>;
  requestSchema: RequestSchema;
  queryParamsSchema: QueryParamsSchema;
  responseSchema: ResponseSchema;
};

export async function apiFetch<
  RequestSchema extends z.ZodSchema | undefined,
  QueryParamsSchema extends z.ZodSchema | undefined,
  ResponseSchema extends z.ZodSchema | undefined,
>(
  args: apiFetchArgs<RequestSchema, QueryParamsSchema, ResponseSchema>
): Promise<SchemaOrUndefined<ResponseSchema>> {
  const { requestSchema, queryParamsSchema, responseSchema } = args;

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
  const usedConfig: RequestConfig = useSession
    ? config()
    : {
        apiHost: config().apiHost,
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
    throw await ApiError.createFromResponse(response, {
      sessionWasUsed,
    });
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

function getAuthHeaders(config: RequestConfig): RequestInit["headers"] {
  return config.sessionId
    ? {
        Authorization: `Session ${config.sessionId}`,
      }
    : {};
}

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
