import { z } from "zod";
import { achievementSchema, achievementSettingSchema } from "./achievement";
import { badgeSchema, badgeSettingSchema } from "./badge";
import { connectionSchema } from "./connection";
import { isDate } from "./utils";

export const userSchema = z.object({
  name: z.string().min(1),
  imageSource: z.string().optional(),
  description: z.string().optional(),
  about: z.string().optional(),
  accountCreated: z.string().refine(isDate),
  lastActive: z.string().refine(isDate),
  dynamicLinks: z.optional(
    z.object({ title: z.string(), url: z.string() }).array()
  ),
  achievements: z.optional(achievementSchema.array()),
  showAchievementsOnProfile: z.boolean().optional(),
  badges: z.optional(badgeSchema.array()),
  showBadgesOnProfile: z.boolean().optional(),
});

export const userSettingsSchema = userSchema.extend({
  achievements: z.optional(achievementSettingSchema.array()),
  badges: z.optional(badgeSettingSchema.array()),
  connections: z.optional(connectionSchema.array()),
});
