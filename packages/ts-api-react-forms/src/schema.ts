import { z } from "zod";

export const createTeamFormSchema = z.object({
  name: z
    .string({ required_error: "Team name is required" })
    .min(1, { message: "Team name is required" }),
});

// TODO: Add these manually at the form
// author_name: z.string(),
// upload_uuid: z.string(),
export const uploadPackageFormSchema = z.object({
  team: z.string(),
  community_categories: z.record(z.array(z.string())),
  communities: z.array(z.string()).nonempty(),
  has_nsfw_content: z.boolean(),
});
