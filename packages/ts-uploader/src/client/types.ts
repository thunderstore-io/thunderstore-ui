export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

export type GenericApiError = {
  detail?: string;
};

export type UserMedia = {
  uuid: string;
  datetime_created: string;
  expiry: string;
  status: string;
  filename: string;
  size: number;
};
export type UploadPartUrl = {
  part_number: number;
  url: string;
  offset: number;
  length: number;
};
export type InitUploadResponse = {
  user_media: UserMedia;
  upload_urls: UploadPartUrl[];
};
export type CompletedPart = {
  ETag: string;
  PartNumber: number;
};
export type FinishUploadRequest = {
  parts: CompletedPart[];
};
