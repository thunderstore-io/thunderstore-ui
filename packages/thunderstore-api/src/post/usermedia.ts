import { ApiEndpointProps } from "../index";
import { apiFetch } from "../apiFetch";
import {
  UsermediaAbortUploadRequestParams,
  UsermediaFinishUploadRequestData,
  usermediaFinishUploadRequestDataSchema,
  UsermediaFinishUploadRequestParams,
  UsermediaInitiateUploadRequestData,
  usermediaInitiateUploadRequestDataSchema,
} from "../schemas/requestSchemas";
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
  props: ApiEndpointProps<object, object, UsermediaInitiateUploadRequestData>
): Promise<UsermediaInitiateUploadResponseData> {
  const { config, useSession, data } = props;
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
      useSession,
    },
    requestSchema: usermediaInitiateUploadRequestDataSchema,
    queryParamsSchema: z.object({}),
    responseSchema: usermediaInitiateUploadResponseDataSchema,
  });
}

export function postUsermediaAbort(
  props: ApiEndpointProps<UsermediaAbortUploadRequestParams, object, object>
): Promise<UsermediaAbortUploadResponseData> {
  const { config, useSession, params } = props;
  const path = `/api/experimental/usermedia/${params.uuid}/abort-upload/`;

  return apiFetch({
    args: {
      config,
      path,
      request: {
        method: "POST",
        cache: "no-store",
      },
      useSession,
    },
    requestSchema: z.object({}),
    queryParamsSchema: z.object({}),
    responseSchema: usermediaAbortUploadResponseDataSchema,
  });
}

export function postUsermediaFinish(
  props: ApiEndpointProps<
    UsermediaFinishUploadRequestParams,
    object,
    UsermediaFinishUploadRequestData
  >
): Promise<UsermediaFinishUploadResponseData> {
  const { config, useSession, params, data } = props;
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
      useSession,
    },
    requestSchema: usermediaFinishUploadRequestDataSchema,
    queryParamsSchema: z.object({}),
    responseSchema: usermediaFinishUploadResponseDataSchema,
  });
}
