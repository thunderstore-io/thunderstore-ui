import { UserMedia, InitUploadResponse, FinishUploadRequest } from "./types";
import { UsermediaUrls } from "./urls";
import { apiFetch } from "./fetch";
import { ApiConfig } from "./config";

type RequestConfig = {
  path: string;
  data?: object;
};
async function apiPost<T>(api: ApiConfig, request: RequestConfig) {
  const response = await apiFetch({
    url: `${api.domain}${request.path}`,
    data: request.data,
    authorization: api.authorization,
    method: "POST",
  });
  return (await response.json()) as T;
}

export async function usermediaInit(
  api: ApiConfig,
  args: {
    data: { filename: string; file_size_bytes: number };
  }
): Promise<InitUploadResponse> {
  return await apiPost(api, {
    path: UsermediaUrls.init,
    data: args.data,
  });
}

export async function usermediaFinish(
  api: ApiConfig,
  args: {
    uuid: string;
    data: FinishUploadRequest;
  }
): Promise<UserMedia> {
  return await apiPost(api, {
    path: UsermediaUrls.finish(args.uuid),
    data: args.data,
  });
}

export async function usermediaAbort(
  api: ApiConfig,
  args: { uuid: string }
): Promise<UserMedia> {
  return await apiPost(api, {
    path: UsermediaUrls.finish(args.uuid),
  });
}
