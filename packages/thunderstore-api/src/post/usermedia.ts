import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";
import {
  UsermediaAbortUploadRequestParams,
  UsermediaFinishUploadRequestData,
  usermediaFinishUploadRequestDataSchema,
  UsermediaFinishUploadRequestParams,
  UsermediaInitiateUploadRequestData,
  usermediaInitiateUploadRequestDataSchema,
} from "../schemas/requestSchemas";
import { RequestGenericMeta } from "../types";
import {
  UsermediaAbortUploadResponseData,
  usermediaAbortUploadResponseDataSchema,
  UsermediaFinishUploadResponseData,
  usermediaFinishUploadResponseDataSchema,
  UsermediaInitiateUploadResponseData,
  usermediaInitiateUploadResponseDataSchema,
} from "../schemas/responseSchemas";
import { z } from "zod";

export function postUsermediaInitiate(
  config: () => RequestConfig,
  meta: RequestGenericMeta,
  data: UsermediaInitiateUploadRequestData
): Promise<UsermediaInitiateUploadResponseData> {
  const path = `/api/experimental/usermedia/initiate-upload/`;

  return apiFetch({
    args: {
      config,
      path,
      request: {
        method: "POST",
        cache: "no-store",
        body: JSON.stringify(data),
      },
      useSession: meta.useSession,
    },
    requestSchema: usermediaInitiateUploadRequestDataSchema,
    queryParamsSchema: z.object({}),
    responseSchema: usermediaInitiateUploadResponseDataSchema,
  });
}

export function postUsermediaAbort(
  config: () => RequestConfig,
  params: UsermediaAbortUploadRequestParams,
  meta: RequestGenericMeta
): Promise<UsermediaAbortUploadResponseData> {
  const path = `/api/experimental/usermedia/${params.uuid}/abort-upload/`;

  return apiFetch({
    args: {
      config,
      path,
      request: {
        method: "POST",
        cache: "no-store",
      },
      useSession: meta.useSession,
    },
    requestSchema: z.object({}),
    queryParamsSchema: z.object({}),
    responseSchema: usermediaAbortUploadResponseDataSchema,
  });
}

export function postUsermediaFinish(
  config: () => RequestConfig,
  params: UsermediaFinishUploadRequestParams,
  meta: RequestGenericMeta,
  data: UsermediaFinishUploadRequestData
): Promise<UsermediaFinishUploadResponseData> {
  const path = `/api/experimental/usermedia/${params.uuid}/finish-upload/`;

  return apiFetch({
    args: {
      config,
      path,
      request: {
        method: "POST",
        cache: "no-store",
        body: JSON.stringify(data),
      },
      useSession: meta.useSession,
    },
    requestSchema: usermediaFinishUploadRequestDataSchema,
    queryParamsSchema: z.object({}),
    responseSchema: usermediaFinishUploadResponseDataSchema,
  });
}
