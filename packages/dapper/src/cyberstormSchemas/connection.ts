import { z } from "zod";

export const connectionSchema = z.object({
  name: z.string(),
  connectedUsername: z.string(),
  imageSource: z.string(),
  enabled: z.boolean(),
});
