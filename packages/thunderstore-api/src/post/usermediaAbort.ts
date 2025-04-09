import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";
import { UsermediaAbortUploadRequestParams } from "../schemas/requestSchemas";
import { RequestGenericMeta } from "../types";
import {
  UsermediaAbortUploadResponseData,
  usermediaAbortUploadResponseDataSchema,
} from "../schemas/responseSchemas";
import { z } from "zod";

export function postUsermediaAbort(
  config: () => RequestConfig,
  params: UsermediaAbortUploadRequestParams,
  meta: RequestGenericMeta
): Promise<UsermediaAbortUploadResponseData> {
  const path = `/api/experimental/usermedia/${params.uuid}/abort-upload/`;

  return apiFetch(
    {
      config,
      path,
      request: {
        method: "POST",
        cache: "no-store",
      },
      useSession: meta.useSession,
    },
    z.object({}),
    usermediaAbortUploadResponseDataSchema
  );
}
