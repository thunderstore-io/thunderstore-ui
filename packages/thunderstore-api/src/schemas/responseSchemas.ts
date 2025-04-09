import { z } from "zod";
import {
  userMediaSchema,
  usermediaUploadPartUrlSchema,
} from "../schemas/objectSchemas";

export const usermediaInitiateUploadResponseDataSchema = z.object({
  user_media: userMediaSchema,
  upload_urls: z.array(usermediaUploadPartUrlSchema),
});

export type UsermediaInitiateUploadResponseData = z.infer<
  typeof usermediaInitiateUploadResponseDataSchema
>;

export const usermediaFinishUploadResponseDataSchema = userMediaSchema;

export type UsermediaFinishUploadResponseData = z.infer<
  typeof usermediaFinishUploadResponseDataSchema
>;

export const usermediaAbortUploadResponseDataSchema = userMediaSchema;

export type UsermediaAbortUploadResponseData = z.infer<
  typeof usermediaAbortUploadResponseDataSchema
>;
