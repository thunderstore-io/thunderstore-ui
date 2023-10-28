import { fetchWithProgress } from "../client/fetch";
import { CompletedPart } from "../client/types";

export type UploadRequestConfig = {
  url: string;
  onProgress?: (instance: UploadRequest, progress: UploadProgress) => any;
  onComplete: (instance: UploadRequest, response: Response) => any;
};
export type UploadProgress = {
  total: number;
  complete: number;
};
type UploadPayload = {
  data: Blob;
  md5: string;
};

export class UploadRequest {
  readonly payload: UploadPayload;
  readonly config: UploadRequestConfig;
  request?: XMLHttpRequest;

  progress: UploadProgress;

  result?: CompletedPart;

  constructor(payload: UploadPayload, config: UploadRequestConfig) {
    this.payload = payload;
    this.config = config;
    this.progress = { total: payload.data.size, complete: 0 };
  }

  public retry() {
    if (this.request) {
      if (this.request.readyState != this.request.DONE) {
        throw new Error("Unable to retry an ongoing request");
      }
      this.request = undefined;
    }
    this.upload();
  }

  public upload() {
    if (this.request != undefined) {
      throw new Error("Upload already started!");
    }

    this.progress = { total: this.payload.data.size, complete: 0 };

    const { request, response } = fetchWithProgress({
      url: this.config.url,
      opts: {
        method: "PUT",
        headers: new Headers({
          "Content-MD5": this.payload.md5,
        }),
        body: this.payload.data,
      },
      onProgress: (ev) => {
        this.progress = {
          total: ev.total,
          complete: ev.loaded,
        };
        if (this.config.onProgress) {
          this.config.onProgress(this, this.progress);
        }
      },
    });
    this.request = request;

    if (this.config.onComplete) {
      const onComplete = this.config.onComplete;
      response.then((resp) => onComplete(this, resp));
    }
  }
}
