import { z } from "zod";

export type GenericApiError = {
  detail?: string;
};

export const userMediaSchema = z.object({
  uuid: z.string(),
  datetime_created: z.string(),
  expiry: z.string(),
  status: z.string(),
  filename: z.string(),
  size: z.number(),
});

export type UserMedia = z.infer<typeof userMediaSchema>;

export const usermediaUploadPartUrlSchema = z.object({
  part_number: z.number(),
  url: z.string(),
  offset: z.number(),
  length: z.number(),
});

export type UsermediaUploadPartUrl = z.infer<
  typeof usermediaUploadPartUrlSchema
>;

export const usermediaCompletedPartSchema = z.object({
  ETag: z.string(),
  PartNumber: z.number(),
});

export type UsermediaCompletedPart = z.infer<
  typeof usermediaCompletedPartSchema
>;
