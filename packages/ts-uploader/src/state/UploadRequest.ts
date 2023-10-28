import { fetchWithProgress } from "../client/fetch";
import { CompletedPart } from "../client/types";

export type UploadRequestConfig = {
  url: string;
  onProgress?: (instance: UploadRequest, progress: UploadProgress) => any;
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

  progress: UploadProgress;

  // Only intended to be used for aborting an ongoing upload
  private _ongoingRequest?: XMLHttpRequest;

  result?: CompletedPart;

  constructor(payload: UploadPayload, config: UploadRequestConfig) {
    this.payload = payload;
    this.config = config;
    this.progress = { total: payload.data.size, complete: 0 };
  }

  public abort() {
    if (this._ongoingRequest) {
      this._ongoingRequest.abort();
      this._ongoingRequest = undefined;
    }
  }

  private onError(e: unknown | Error) {
    // TODO: Broadcast an error event instead of implementing handling here.
    console.error(e);
  }

  public async upload<T>(transformResult: (res: Response) => T): Promise<T> {
    this.progress = { total: this.payload.data.size, complete: 0 };

    const fetchArgs = {
      url: this.config.url,
      opts: {
        method: "PUT",
        headers: new Headers({
          "Content-MD5": this.payload.md5,
        }),
        body: this.payload.data,
      },
      onProgress: (ev: ProgressEvent) => {
        this.progress = {
          total: ev.total,
          complete: ev.loaded,
        };
        if (this.config.onProgress) {
          this.config.onProgress(this, this.progress);
        }
      },
    };

    let numRetries = 0;
    let lastError: unknown;

    while (numRetries < 3) {
      try {
        const { request, response } = fetchWithProgress(fetchArgs);
        this._ongoingRequest = request;
        const resp = await response;
        if (!resp.ok) {
          console.error(
            `Upload failed due to non-success status code: ${resp.status}`
          );
        }
        return transformResult(resp);
      } catch (e) {
        numRetries++;
        this.onError(e);
        lastError = e;
      } finally {
        this._ongoingRequest = undefined;
      }
    }

    // TODO: Also return a promise that doesn't resolve unless the upload has
    //       either finished or been aborted externally. That promise should
    //       not resolve even if we run out of automatic retries or the upload
    //       is paused for example.
    throw lastError;
  }
}
