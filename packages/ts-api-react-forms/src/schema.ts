import { z } from "zod";

export const createTeamFormSchema = z.object({
  name: z
    .string({ required_error: "Team name is required" })
    .min(1, { message: "Team name is required" }),
});
