import { z } from "zod";
import { ApiError, fetchCurrentUser } from "@thunderstore/thunderstore-api";

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

export const currentUserSchema = z.object({
  username: z.string().nonempty(),
  capabilities: z.string().array(),
  connections: oAuthConnectionSchema.array(),
  subscription: z.object({
    expires: z.string().datetime().nullable(),
  }),
  teams: teamSchema.array(),
});

const schema = z.object({
  username: z.string().nonempty(),
  capabilities: z.string().array(),
  connections: oAuthConnectionSchema.array(),
  subscription: z.object({
    expires: z.string().datetime().nullable(),
  }),
  teams_full: teamSchema.array(),
});

export const emptyUser = {
  username: null,
  capabilities: [],
  connections: [],
  subscription: { expires: null },
  teams: [],
};

export async function getCurrentUser(this: DapperTsInterface) {
  if (typeof this.config().sessionId !== "string") {
    return emptyUser;
  }

  try {
    const data = await fetchCurrentUser(this.config);
    const parsed = schema.safeParse(data);

    if (!parsed.success) {
      // Sometimes the endpoint will be called without auths and we need to return empty user manually here.
      // If the username is null it's equivalent gracefully "saying no current user"
      if (data.username === null) {
        return emptyUser;
      }

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
  } catch (err) {
    if (
      err instanceof ApiError &&
      err.response.status === 401 &&
      this.removeSessionHook
    ) {
      this.removeSessionHook();
      return emptyUser;
    } else {
      throw err;
    }
  }
}
