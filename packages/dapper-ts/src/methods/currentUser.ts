import { z } from "zod";
import { fetchCurrentUser } from "@thunderstore/thunderstore-api";

import { DapperTsInterface } from "../index";
import { formatErrorMessage } from "../utils";

const oAuthConnectionSchema = z.object({
  provider: z.string().nonempty(),
  username: z.string().nonempty(),
  avatar: z.string().nullable(),
});

const teamSchema = z.object({
  name: z.string().nonempty(),
  role: z.union([z.literal("owner"), z.literal("member")]),
  member_count: z.number().int().gte(1),
});

const schema = z.object({
  username: z.string().nonempty(),
  capabilities: z.string().array(),
  connections: oAuthConnectionSchema.array(),
  rated_packages: z.string().array(),
  subscription: z.object({
    expires: z.string().datetime().nullable(),
  }),
  teams_full: teamSchema.array(),
});

export async function getCurrentUser(this: DapperTsInterface) {
  if (this.config.sessionId === undefined) {
    return {
      username: null,
      capabilities: [],
      connections: [],
      rated_packages: [],
      subscription: { expires: null },
      teams: [],
    };
  }

  const data = await fetchCurrentUser(this.config);
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    throw new Error(formatErrorMessage(parsed.error));
  }

  // For legacy support, the backend returns teams in two formats.
  // Clients don't need to know about the old one, so replace it with
  // the new one.
  const { teams_full, ...currentUser } = {
    ...parsed.data,
    teams: parsed.data.teams_full,
  };

  return currentUser;
}
