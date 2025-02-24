import { z } from "zod";

export const packageLikeActionSchema = z.object({
  target_state: z.union([z.literal("rated"), z.literal("unrated")]),
});

export const packageLikeActionReturnSchema = z.object({
  state: z.union([z.literal("rated"), z.literal("unrated")]),
  score: z.number(),
});

export const PackageDeprecateActionSchema = z.object({
  is_deprecated: z.boolean(),
});
