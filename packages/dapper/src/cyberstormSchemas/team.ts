import { z } from "zod";

export const teamMemberSchema = z.object({
  user: z.string().min(1),
  imageSource: z.string().optional(),
  role: z.string(),
});

export const teamSchema = z.object({
  name: z.string().min(1),
  imageSource: z.string().optional(),
  description: z.string().optional(),
  about: z.string().optional(),
  members: teamMemberSchema.array(),
  dynamicLinks: z.optional(
    z.object({ title: z.string(), url: z.string() }).array()
  ),
  donationLink: z.string().optional(),
});

export const teamSettingsSchema = teamSchema.extend({
  serviceAccounts: z.string().array(), // ServiceAccount ids
});
