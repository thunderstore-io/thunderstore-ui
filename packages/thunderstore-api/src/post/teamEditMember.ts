// THIS API ENDPOINT IS NOT IMPLEMENTED YET IN THE THUNDERSTORE API

import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";
import z from "zod";

export type teamEditMemberMetaArgs = {
  teamIdentifier: string;
};

export type teamEditMemberApiArgs = {
  username: string;
  role: string;
};

export function teamEditMember(
  config: () => RequestConfig,
  data: teamEditMemberApiArgs,
  meta: teamEditMemberMetaArgs
) {
  const path = `/api/cyberstorm/team/${meta.teamIdentifier}/members/edit/`;

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
    // requestSchema: teamEditMemberRequestSchema,
    requestSchema: z.object({}),
    queryParamsSchema: z.object({}),
    // responseSchema: teamEditMemberResponseSchema,
    responseSchema: z.object({}),
  });
}
