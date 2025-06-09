// THIS API ENDPOINT IS NOT IMPLEMENTED YET IN THE THUNDERSTORE API

import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";
import z from "zod";

export interface userDeleteApiArgs {
  verification: string;
}

export function userDelete(
  config: () => RequestConfig,
  data: userDeleteApiArgs
) {
  const path = `/api/cyberstorm/current-user/delete/`;

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
    // requestSchema: userDeleteRequestSchema,
    requestSchema: z.object({}),
    queryParamsSchema: z.object({}),
    // responseSchema: userDeleteResponseSchema,
    responseSchema: z.object({}),
  });
}
