import { UserMedia } from "../client/types";
import { UsermediaEndpoints } from "../client/endpoints";
import { ApiConfig } from "../client/config";

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

  constructor(
    handle: UserMedia,
    opts: MultiPartUploadOptions,
    parts: UploadPart[]
  ) {
    this.handle = handle;
    this.opts = opts;
    this.parts = parts;
  }
}
