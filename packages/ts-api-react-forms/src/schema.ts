import { z } from "zod";

export const createTeamFormSchema = z.object({
  name: z
    .string({ required_error: "Team name is required" })
    .min(1, { message: "Team name is required" }),
});

export const teamDetailsEditFormSchema = z.object({
  donation_link: z
    .string({ required_error: "Donation link is required" })
    .min(1, { message: "Donation link is required" }),
});
