import { z } from "zod";
import {
  fetchTeamDetails,
  fetchTeamMembers,
  fetchTeamServiceAccounts,
} from "@thunderstore/thunderstore-api";

import { DapperTsInterface } from "../index";
import { formatErrorMessage } from "../utils";

const detailsSchema = z.object({
  identifier: z.number().int().gt(0),
  name: z.string().nonempty(),
  donation_link: z.string().nullable(),
});

export async function getTeamDetails(
  this: DapperTsInterface,
  teamName: string
) {
  const data = await fetchTeamDetails(this.config, teamName);
  const parsed = detailsSchema.safeParse(data);

  if (!parsed.success) {
    // TODO: add Sentry support and log parsed.error.
    throw new Error("Invalid data received from backend");
  }

  return parsed.data;
}

const membersSchema = z
  .object({
    identifier: z.number().int().gt(0),
    username: z.string().nonempty(),
    avatar: z.string().nullable(),
    role: z.union([z.literal("owner"), z.literal("member")]),
  })
  .array();

export async function getTeamMembers(
  this: DapperTsInterface,
  teamName: string
) {
  const data = await fetchTeamMembers(this.config, teamName);
  const parsed = membersSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error(formatErrorMessage(parsed.error));
  }

  return parsed.data;
}

const serviceAccountSchema = z
  .object({
    identifier: z.string().uuid(),
    name: z.string().nonempty(),
    last_used: z.string().datetime().nullable(),
  })
  .array();

export async function getTeamServiceAccounts(
  this: DapperTsInterface,
  teamName: string
) {
  const data = await fetchTeamServiceAccounts(this.config, teamName);
  const parsed = serviceAccountSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error(formatErrorMessage(parsed.error));
  }

  return parsed.data;
}
