import { FetchArgs, fetchWithProgress } from "../client/fetch";

type UploadRequestConfig = {
  url: string;
  onProgress: FetchArgs["onProgress"];
};
type UploadPayload = {
  data: Blob;
  md5: string;
};

export class UploadRequest {
  readonly payload: UploadPayload;
  readonly config: UploadRequestConfig;
  request?: XMLHttpRequest;

  constructor(payload: UploadPayload, config: UploadRequestConfig) {
    this.payload = payload;
    this.config = config;
  }

  public upload() {
    const { request, response } = fetchWithProgress({
      url: this.config.url,
      opts: {
        method: "PUT",
        headers: new Headers({
          "Content-MD5": this.payload.md5,
        }),
        body: this.payload.data,
      },
      onProgress: this.config.onProgress,
    });
    this.request = request;
    return response;
  }
}
