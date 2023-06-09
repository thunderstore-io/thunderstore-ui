import { z } from "zod";

export const communityPreviewSchema = z.object({
  name: z.string().max(256),
  namespace: z.string().max(256),
  downloadCount: z.number().nonnegative().int(),
  packageCount: z.number().nonnegative().int(),
  serverCount: z.number().nonnegative().int(),
  imageSource: z.optional(z.string()),
});

export const communitySchema = communityPreviewSchema.extend({
  description: z.string().optional(),
  discordLink: z.string().optional(),
});
