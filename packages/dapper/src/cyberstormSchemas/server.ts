import { z } from "zod";

export const serverPreviewSchema = z.object({
  name: z.string().min(1),
  imageSource: z.string().optional(),
  isPvp: z.boolean(),
  hasPassword: z.boolean(),
  packageCount: z.number().int(),
});

export const serverSchema = serverPreviewSchema.extend({
  namespace: z.string().min(1),
  community: z.string(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  likes: z.number().int(),
  address: z.string(),
  author: z.string(),
  dynamicLinks: z.optional(
    z.object({ title: z.string(), url: z.string() }).array()
  ),
});
