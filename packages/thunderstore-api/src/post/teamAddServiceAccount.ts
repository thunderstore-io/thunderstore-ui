// THIS API ENDPOINT IS NOT IMPLEMENTED YET IN THE THUNDERSTORE API

import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";
import z from "zod";

export type teamAddServiceAccountMetaArgs = {
  teamIdentifier: string;
};

export type teamAddServiceAccountApiArgs = {
  nickname: string;
};

export function teamAddServiceAccount(
  config: () => RequestConfig,
  data: teamAddServiceAccountApiArgs,
  meta: teamAddServiceAccountMetaArgs
) {
  const path = `api/cyberstorm/team/${meta.teamIdentifier}/service-account/create/`;

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
    // requestSchema: teamAddServiceAccountDataSchema,
    requestSchema: z.object({}),
    queryParamsSchema: z.object({}),
    // responseSchema: teamAddServiceAccountResponseDataSchema,
    responseSchema: z.object({}),
  });
}
