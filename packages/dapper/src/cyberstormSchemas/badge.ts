import { z } from "zod";

export const badgeSchema = z.object({
  name: z.string().min(1),
  imageSource: z.string(),
  description: z.string(),
});

export const badgeSettingSchema = badgeSchema.extend({
  enabled: z.boolean(),
});
