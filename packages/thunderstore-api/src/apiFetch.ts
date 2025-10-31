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

  const wrapperPromise =
    Promise.withResolvers<schemaOrUndefined<typeof responseSchema>>();
  try {
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
    // TODO: Query params have stronger types, but they are not just shown here.
    // Look into furthering the ensuring of passing proper query params.
    const url = getUrl(usedConfig, path, queryParams);

    const response = await fetchRetry(url, {
      ...(request ?? {}),
      headers: {
        ...BASE_HEADERS,
        ...getAuthHeaders(usedConfig),
      },
    });

    if (!response.ok) {
      try {
        const asdError = await ApiError.createFromResponse(response, {
          sessionWasUsed,
        });
        wrapperPromise.reject(asdError);
      } catch (error) {
        wrapperPromise.reject(error);
      }
    }

    if (responseSchema === undefined) return undefined;

    const parsed = responseSchema.safeParse(await response.json());
    if (!parsed.success) {
      throw new ParseError(parsed.error);
    } else {
      wrapperPromise.resolve(parsed.data);
    }
  } catch (err) {
    console.log("asdasdasd", err);
    wrapperPromise.reject(err);
  }

  return wrapperPromise.promise;
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
