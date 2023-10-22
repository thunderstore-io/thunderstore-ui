import {
  UserMedia,
  InitUploadResponse,
  FinishUploadRequest,
  InitUploadRequest,
} from "./types";
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

type ApiCall<Req = undefined, Res = undefined, Args = {}> = (
  api: ApiConfig,
  args: {
    data: Req;
  } & Args
) => Promise<Res>;

export const UsermediaEndpoints: {
  init: ApiCall<InitUploadRequest, InitUploadResponse>;
  finish: ApiCall<FinishUploadRequest, UserMedia, { uuid: string }>;
  abort: ApiCall<undefined, UserMedia, { uuid: string }>;
} = {
  init: (api, args) => {
    return apiPost(api, { path: UsermediaUrls.init, data: args.data });
  },
  finish: (api, args) => {
    return apiPost(api, {
      path: UsermediaUrls.finish(args.uuid),
      data: args.data,
    });
  },
  abort: (api, args) => {
    return apiPost(api, {
      path: UsermediaUrls.abort(args.uuid),
    });
  },
};
