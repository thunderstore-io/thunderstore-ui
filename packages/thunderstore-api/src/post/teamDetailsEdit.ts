// THIS API ENDPOINT IS NOT IMPLEMENTED YET IN THE THUNDERSTORE API

import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";
import z from "zod";

export type teamDetailsEditMetaArgs = {
  teamIdentifier: string;
};

export type teamDetailsEditApiArgs = {
  donation_link: string;
};

export function teamDetailsEdit(
  config: () => RequestConfig,
  data: teamDetailsEditApiArgs,
  meta: teamDetailsEditMetaArgs
) {
  const path = `api/cyberstorm/team/${meta.teamIdentifier}/edit/`;

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
    // requestSchema: teamDetailsEditRequestSchema,
    requestSchema: z.object({}),
    queryParamsSchema: z.object({}),
    // responseSchema: teamDetailsEditResponseSchema,
    responseSchema: z.object({}),
  });
}
