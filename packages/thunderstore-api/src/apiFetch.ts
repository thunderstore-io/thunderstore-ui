import { z } from "zod";

import {
  ApiError,
  ParseError,
  RequestBodyParseError,
  RequestQueryParamsParseError,
} from "./index";
import type { RequestConfig } from "./index";
import { serializeQueryString } from "./queryString";

const BASE_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

// Cap SSR API requests so a slow backend can't hang the whole page render.
// Server-only (no window); the browser owns client-side request timing.
const SSR_API_TIMEOUT_MS = 500;

// No auto-retry: a blanket client-side retry amplifies backend load during an
// outage (self-inflicted DDoS) and can duplicate non-idempotent writes. Recovery
// is explicit instead — FetchErrorState's Retry button and loader revalidation.

export type apiFetchArgs<B, QP> = {
  config: () => RequestConfig;
  path: string;
  queryParams?: QP;
  request?: Omit<RequestInit, "headers" | "body"> & { body?: string };
  useSession?: boolean;
  bodyRaw?: B;
};

type schemaOrUndefined<A> = A extends z.ZodSchema
  ? z.infer<A>
  : never | undefined;

export async function apiFetch(props: {
  args: apiFetchArgs<
    schemaOrUndefined<typeof props.requestSchema>,
    schemaOrUndefined<typeof props.queryParamsSchema>
  >;
  requestSchema: z.ZodSchema | undefined;
  queryParamsSchema: z.ZodSchema | undefined;
  responseSchema: z.ZodSchema | undefined;
}): Promise<schemaOrUndefined<typeof props.responseSchema>> {
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
  const usedConfig: RequestConfig = useSession
    ? config()
    : {
        apiHost: config().apiHost,
        sessionId: undefined,
      };
  // TODO: Query params have stronger types, but they are not just shown here.
  // Look into furthering the ensuring of passing proper query params.
  const url = getUrl(usedConfig, path, queryParams);

  const response = await fetch(url, {
    ...(request ?? {}),
    headers: {
      ...BASE_HEADERS,
      ...getAuthHeaders(usedConfig),
    },
    ...(typeof window === "undefined"
      ? { signal: AbortSignal.timeout(SSR_API_TIMEOUT_MS) }
      : {}),
  });

  if (!response.ok) {
    throw await ApiError.createFromResponse(response);
  }

  if (responseSchema === undefined) return undefined;

  const parsed = responseSchema.safeParse(await response.json());
  if (!parsed.success) {
    throw new ParseError(parsed.error);
  } else {
    return parsed.data;
  }
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
