import { z } from "zod";

export const packageLikeActionSchema = z.object({
  target_state: z.union([z.literal("rated"), z.literal("unrated")]),
});
