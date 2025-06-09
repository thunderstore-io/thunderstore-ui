// THIS API ENDPOINT IS NOT IMPLEMENTED YET IN THE THUNDERSTORE API

import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";
import z from "zod";

export type teamRemoveMemberMetaArgs = {
  teamIdentifier: string;
  username: string;
};

export function teamRemoveMember(
  config: () => RequestConfig,
  _data: object,
  meta: teamRemoveMemberMetaArgs
) {
  const path = `/api/cyberstorm/team/${meta.teamIdentifier}/members/remove/`;

  return apiFetch({
    args: {
      config,
      path,
      request: {
        method: "POST",
        body: JSON.stringify({ username: meta.username }),
      },
      useSession: true,
    },
    // requestSchema: teamRemoveMemberRequestSchema,
    requestSchema: z.object({}),
    queryParamsSchema: z.object({}),
    // responseSchema: teamRemoveMemberResponseSchema,
    responseSchema: z.object({}),
  });
}
