import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";
import { z } from "zod";
import {
  CurrentUserResponseData,
  currentUserResponseDataSchema,
} from "../schemas/responseSchemas";

export async function fetchCurrentUser(
  config: () => RequestConfig
): Promise<CurrentUserResponseData> {
  const path = "api/experimental/current-user/";
  const request = { cache: "no-store" as RequestCache };

  return await apiFetch({
    args: { config, path, request, useSession: true },
    requestSchema: z.object({}),
    queryParamsSchema: z.object({}),
    responseSchema: currentUserResponseDataSchema,
  });
}
