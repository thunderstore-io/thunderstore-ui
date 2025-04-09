import { z } from "zod";
import { usermediaCompletedPartSchema } from "./objectSchemas";

// UsermediaInitiateUploadRequest
export const usermediaInitiateUploadRequestDataSchema = z.object({
  filename: z.string(),
  file_size_bytes: z.number(),
});

export type UsermediaInitiateUploadRequestData = z.infer<
  typeof usermediaInitiateUploadRequestDataSchema
>;

// UsermediaFinishUploadRequest
export const usermediaFinishUploadRequestParamsSchema = z.object({
  uuid: z.string(),
});

export type UsermediaFinishUploadRequestParams = z.infer<
  typeof usermediaFinishUploadRequestParamsSchema
>;

export const usermediaFinishUploadRequestDataSchema = z.object({
  parts: z.array(usermediaCompletedPartSchema),
});

export type UsermediaFinishUploadRequestData = z.infer<
  typeof usermediaFinishUploadRequestDataSchema
>;

// UsermediaAbortUploadRequest
export const usermediaAbortUploadRequestParamsSchema = z.object({
  uuid: z.string(),
});

export type UsermediaAbortUploadRequestParams = z.infer<
  typeof usermediaAbortUploadRequestParamsSchema
>;
