import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";
import { z } from "zod";
import { currentUserResponseDataSchema } from "../schemas/responseSchemas";
import { CurrentUser } from "../schemas/objectSchemas";

export async function fetchCurrentUser(
  config: () => RequestConfig
): Promise<CurrentUser> {
  const path = "api/experimental/current-user/";
  const request = { cache: "no-store" as RequestCache };

  return await apiFetch({
    args: { config, path, request, useSession: true },
    requestSchema: z.object({}),
    queryParamsSchema: z.object({}),
    responseSchema: currentUserResponseDataSchema,
  });
}
