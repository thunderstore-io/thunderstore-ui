import { RequestConfig } from "@thunderstore/thunderstore-api";
import {
  UserMedia,
  InitUploadResponse,
  FinishUploadRequest,
  InitUploadRequest,
} from "./types";
import { UsermediaUrls } from "./urls";

type ApiCall<Req = undefined, Res = undefined, Args = object> = (
  requestConfig: RequestConfig,
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
