import { z } from "zod";

export const authorSchema = z.object({
  user: z.string().min(1), // TODO: Probably needs to be updated to User schema, but after the auth is done.
  imageSource: z.optional(z.string()),
  role: z.string(),
});
