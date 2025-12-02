import { apiFetch } from "../apiFetch";
import { type ApiEndpointProps } from "../index";
import {
  type UsermediaAbortUploadRequestParams,
  type UsermediaFinishUploadRequestData,
  type UsermediaFinishUploadRequestParams,
  type UsermediaInitiateUploadRequestData,
  usermediaFinishUploadRequestDataSchema,
  usermediaInitiateUploadRequestDataSchema,
} from "../schemas/requestSchemas";
import {
  type UsermediaAbortUploadResponseData,
  type UsermediaFinishUploadResponseData,
  type UsermediaInitiateUploadResponseData,
  usermediaAbortUploadResponseDataSchema,
  usermediaFinishUploadResponseDataSchema,
  usermediaInitiateUploadResponseDataSchema,
} from "../schemas/responseSchemas";

export function postUsermediaInitiate(
  props: ApiEndpointProps<object, object, UsermediaInitiateUploadRequestData>
): Promise<UsermediaInitiateUploadResponseData> {
  const { config, useSession, data } = props;
  const path = `/api/experimental/usermedia/initiate-upload/`;

  return apiFetch({
    config,
    path,
    request: {
      method: "POST",
      cache: "no-store",
      body: JSON.stringify(data),
    },
    useSession,
    requestSchema: usermediaInitiateUploadRequestDataSchema,
    queryParamsSchema: undefined,
    responseSchema: usermediaInitiateUploadResponseDataSchema,
  });
}

export function postUsermediaAbort(
  props: ApiEndpointProps<UsermediaAbortUploadRequestParams, object, object>
): Promise<UsermediaAbortUploadResponseData> {
  const { config, useSession, params } = props;
  const path = `/api/experimental/usermedia/${params.uuid}/abort-upload/`;

  return apiFetch({
    config,
    path,
    request: {
      method: "POST",
      cache: "no-store",
    },
    useSession,
    requestSchema: undefined,
    queryParamsSchema: undefined,
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
    config,
    path,
    request: {
      method: "POST",
      cache: "no-store",
      body: JSON.stringify(data),
    },
    useSession,
    requestSchema: usermediaFinishUploadRequestDataSchema,
    queryParamsSchema: undefined,
    responseSchema: usermediaFinishUploadResponseDataSchema,
  });
}
