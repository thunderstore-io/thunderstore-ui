import { fetchWithProgress } from "../client/fetch";

export type UploadRequestConfig<T> = {
  url: string;
  onProgress?: (instance: UploadRequest<T>, progress: UploadProgress) => any;
};
export type UploadProgress = {
  total: number;
  complete: number;
};
type UploadPayload = {
  data: Blob;
  md5: string;
};

export type UploadRequestStatus =
  | "pending"
  | "complete"
  | "failed"
  | "running"
  | "aborted";

export class UploadRequest<T> {
  readonly payload: UploadPayload;
  readonly config: UploadRequestConfig<T>;
  readonly transformer: (res: Response) => T;

  status: UploadRequestStatus;
  progress: UploadProgress;
  result: T | undefined;

  // Only intended to be used for aborting an ongoing upload
  private _ongoingRequest?: XMLHttpRequest;

  constructor(
    payload: UploadPayload,
    config: UploadRequestConfig<T>,
    transformer: (res: Response) => T
  ) {
    this.payload = payload;
    this.config = config;
    this.transformer = transformer;
    this.progress = { total: payload.data.size, complete: 0 };
    this.status = "pending";
  }

  public abort() {
    if (this._ongoingRequest) {
      this._ongoingRequest.abort();
      this._ongoingRequest = undefined;
      this.status = "aborted";
    }
  }

  private onError(e: unknown | Error) {
    // TODO: Broadcast an error event instead of implementing handling here.
    console.error(e);
  }

  public async upload(): Promise<T> {
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

    this.status = "running";
    while (numRetries < 3) {
      try {
        const { request, response } = fetchWithProgress(fetchArgs);
        this._ongoingRequest = request;
        const resp = await response;
        if (!resp.ok) {
          throw new Error(
            `Upload failed due to non-success status code: ${resp.status}`
          );
        }
        this.result = this.transformer(resp);
        this.status = "complete";
        return this.result;
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
    this.status = "failed";
    throw lastError;
  }
}
