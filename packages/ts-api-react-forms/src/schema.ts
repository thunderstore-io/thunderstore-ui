import { z } from "zod";

export const createTeamFormSchema = z.object({
  name: z
    .string({ required_error: "Team name is required" })
    .min(1, { message: "Team name is required" }),
});

export const teamAddMemberFormSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(1, { message: "Username is required" }),
  role: z
    .string({ required_error: "Role is required" })
    .min(1, { message: "Role is required" }),
});

export const teamEditMemberFormSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(1, { message: "Username is required" }),
  role: z
    .string({ required_error: "Role is required" })
    .min(1, { message: "Role is required" }),
});

export const teamDetailsEditFormSchema = z.object({
  donation_link: z
    .string({ required_error: "Donation link is required" })
    .min(1, { message: "Donation link is required" }),
});

export const teamAddServiceAccountFormSchema = z.object({
  nickname: z
    .string({ required_error: "Nickname is required" })
    .min(1, { message: "Nickname is required" }),
});

export const userDeleteFormSchema = z.object({
  verification: z
    .string({ required_error: "Verification is required" })
    .min(1, { message: "Verification is required" }),
});

export const userLinkedAccountDisconnectFormSchema = z.object({
  provider: z.union([
    z.literal("discord"),
    z.literal("github"),
    z.literal("overwolf"),
  ]),
});

export const teamDisbandFormSchema = z.object({
  verification: z
    .string({ required_error: "Verification is required" })
    .min(1, { message: "Verification is required" }),
});

export const packageEditFormSchema = z.object({
  new_categories: z.array(z.string()),
});
