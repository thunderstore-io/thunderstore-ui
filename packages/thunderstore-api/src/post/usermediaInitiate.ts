import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";
import {
  UsermediaInitiateUploadRequestData,
  usermediaInitiateUploadRequestDataSchema,
} from "../schemas/requestSchemas";
import { RequestGenericMeta } from "../types";
import {
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
