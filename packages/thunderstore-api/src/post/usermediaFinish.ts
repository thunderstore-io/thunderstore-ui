import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";
import {
  UsermediaFinishUploadRequestData,
  UsermediaFinishUploadRequestParams,
  usermediaFinishUploadRequestDataSchema,
} from "../schemas/requestSchemas";
import { RequestGenericMeta } from "../types";
import {
  UsermediaFinishUploadResponseData,
  usermediaFinishUploadResponseDataSchema,
} from "../schemas/responseSchemas";

export function postUsermediaFinish(
  config: () => RequestConfig,
  params: UsermediaFinishUploadRequestParams,
  meta: RequestGenericMeta,
  data: UsermediaFinishUploadRequestData
): Promise<UsermediaFinishUploadResponseData> {
  const path = `/api/experimental/usermedia/${params.uuid}/finish-upload/`;

  return apiFetch(
    {
      config,
      path,
      request: {
        method: "POST",
        cache: "no-store",
        body: JSON.stringify(data),
      },
      useSession: meta.useSession,
    },
    usermediaFinishUploadRequestDataSchema,
    usermediaFinishUploadResponseDataSchema
  );
}
