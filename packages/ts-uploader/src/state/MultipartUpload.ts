import { CompletedPart, UserMedia } from "../client/types";
import { UsermediaEndpoints } from "../client/endpoints";
import { ApiConfig } from "../client/config";
import {
  UploadProgress,
  UploadRequest,
  UploadRequestConfig,
} from "./UploadRequest";
import { calculateMD5 } from "../md5";

export type MultiPartUploadOptions = {
  api: ApiConfig;
};

/**
 * A multi-part upload consists of 3 stages:
 *
 * 1. Creating an upload handle on the server. Server returns back an ID and
 *    configuration for how the upload should be chunked.
 * 2. Uploading all chunks to URLs provided by the server in step 1 and storing
 *    the resulting IDs (response ETag header)
 * 3. Finalizing the upload by submitting all chunk IDs obtained from step 2
 *    to the server along with the upload handle ID.
 */

function slicePart(file: File, offset: number, length: number) {
  const start = offset;
  const end = offset + length;
  return end < file.size ? file.slice(start, end) : file.slice(start);
}

async function createUploadRequest(
  part: UploadPart,
  onProgress?: UploadRequestConfig["onProgress"]
): Promise<UploadRequest> {
  // TODO: Async md5 calculation via either wasm or workers
  const md5 = await calculateMD5(part.payload);
  return new UploadRequest(
    {
      data: part.payload,
      md5: md5,
    },
    {
      url: part.meta.url,
      onProgress,
    }
  );
}

export async function initMultipartUpload(
  file: File,
  opts: MultiPartUploadOptions
): Promise<UploadHandle> {
  const result = await UsermediaEndpoints.init(opts.api, {
    data: {
      filename: file.name,
      file_size_bytes: file.size,
    },
  });
  const parts: UploadPart[] = result.upload_urls.map((x) => ({
    payload: slicePart(file, x.offset, x.length),
    meta: x,
  }));
  return new UploadHandle(result.user_media, opts, parts);
}

type UploadPart = {
  payload: Blob;
  meta: {
    part_number: number;
    url: string;
  };
};

class UploadHandle {
  readonly handle: UserMedia;
  readonly opts: MultiPartUploadOptions;
  readonly parts: UploadPart[];

  private requests?: UploadRequest[];

  constructor(
    handle: UserMedia,
    opts: MultiPartUploadOptions,
    parts: UploadPart[]
  ) {
    this.handle = handle;
    this.opts = opts;
    this.parts = parts;
  }

  get progress(): UploadProgress {
    return (this.requests || []).reduce(
      (state, request) => {
        return {
          total: state.total + request.progress.total,
          complete: state.complete + request.progress.complete,
        };
      },
      {
        total: 0,
        complete: 0,
      }
    );
  }

  async startUpload(onProgress?: (progress: UploadProgress) => any) {
    if (this.requests != undefined) {
      throw new Error("Upload already initiated!");
    }

    const progressCallback = () => {
      if (onProgress) onProgress(this.progress);
    };

    this.requests = [];

    const promises = [];
    for (let part of this.parts) {
      const request = await createUploadRequest(part, progressCallback);
      this.requests.push(request);
      promises.push(
        request.upload((response) => {
          const etag = response.headers.get("etag");
          if (!etag) {
            // ETag is filtered out by some browser extensions
            // TODO: Handle somehow better
            throw new Error("ETag header was missing from the response!");
          }
          const result: CompletedPart = {
            ETag: etag,
            PartNumber: part.meta.part_number,
          };
          return result;
        })
      );
    }

    const parts = await Promise.all(promises);
    return UsermediaEndpoints.finish(this.opts.api, {
      data: { parts },
      uuid: this.handle.uuid,
    });
  }
}
