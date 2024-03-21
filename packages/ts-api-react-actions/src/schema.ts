import { z } from "zod";

export const packageLikeActionSchema = z.object({
  target_state: z.union([z.literal("rated"), z.literal("unrated")]),
});

export const PackageDeprecateActionSchema = z.object({
  is_deprecated: z.boolean(),
});
