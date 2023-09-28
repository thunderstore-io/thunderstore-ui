import { z } from "zod";
import { fetchCurrentUser } from "@thunderstore/thunderstore-api";

import { DapperTsInterface } from "../index";

const oAuthConnectionSchema = z.object({
  provider: z.string().nonempty(),
  username: z.string().nonempty(),
  avatar: z.string().nullable(),
});

const schema = z.object({
  username: z.string().nonempty(),
  capabilities: z.string().array(),
  connections: oAuthConnectionSchema.array(),
  rated_packages: z.string().array(),
  subscription: z.object({
    expires: z.string().datetime().nullable(),
  }),
  teams: z.string().array(),
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
    // TODO: add Sentry support and log parsed.error.
    throw new Error("Invalid data received from backend");
  }

  return parsed.data;
}
