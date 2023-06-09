import { z } from "zod";

export const achievementSchema = z.object({
  name: z.string().min(1),
  imageSource: z.string(),
  description: z.string(),
});

export const achievementSettingSchema = achievementSchema.extend({
  enabled: z.boolean(),
});
