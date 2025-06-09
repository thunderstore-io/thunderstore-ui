// THIS API ENDPOINT IS NOT IMPLEMENTED YET IN THE THUNDERSTORE API

import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";
import z from "zod";

export interface userLinkedAccountDisconnectApiArgs {
  provider: "discord" | "github" | "overwolf";
}

export function userLinkedAccountDisconnect(
  config: () => RequestConfig,
  data: userLinkedAccountDisconnectApiArgs
) {
  const path = `/api/cyberstorm/current-user/linked-account-disconnect/`;

  return apiFetch({
    args: {
      config,
      path,
      request: {
        method: "POST",
        body: JSON.stringify(data),
      },
      useSession: true,
    },
    // requestSchema: userLinkedAccountDisconnectRequestSchema,
    requestSchema: z.object({}),
    queryParamsSchema: z.object({}),
    // responseSchema: userLinkedAccountDisconnectResponseSchema,
    responseSchema: z.object({}),
  });
}
