// THIS API ENDPOINT IS NOT IMPLEMENTED YET IN THE THUNDERSTORE API

import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";
import z from "zod";

export type teamServiceAccountRemoveMetaArgs = {
  serviceAccountIdentifier: string;
  teamName: string;
};

export function teamServiceAccountRemove(
  config: () => RequestConfig,
  _data: object,
  meta: teamServiceAccountRemoveMetaArgs
) {
  const path = `/api/cyberstorm/team/${meta.teamName}/service-account/delete/`;

  return apiFetch({
    args: {
      config,
      path,
      request: {
        method: "POST",
        body: JSON.stringify({
          service_account_uuid: meta.serviceAccountIdentifier,
        }),
      },
      useSession: true,
    },
    // requestSchema: teamServiceAccountRemoveRequestSchema,
    requestSchema: z.object({}),
    queryParamsSchema: z.object({}),
    // responseSchema: teamServiceAccountRemoveResponseSchema,
    responseSchema: z.object({}),
  });
}
