import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";
import {
  TeamCreateRequestData,
  teamCreateRequestDataSchema,
  TeamDisbandRequestParams,
} from "../schemas/requestSchemas";
import { z } from "zod";
import {
  TeamCreateResponseData,
  teamCreateResponseDataSchema,
} from "../schemas/responseSchemas";

export function teamCreate(
  config: () => RequestConfig,
  data: TeamCreateRequestData
): Promise<TeamCreateResponseData> {
  const path = "api/cyberstorm/teams/create/";

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
    requestSchema: teamCreateRequestDataSchema,
    queryParamsSchema: z.object({}),
    responseSchema: teamCreateResponseDataSchema,
  });
}

export function teamDisband(
  config: () => RequestConfig,
  params: TeamDisbandRequestParams
) {
  const path = `/api/cyberstorm/team/${params.team_name}/disband/`;

  return apiFetch({
    args: {
      config,
      path,
      request: {
        method: "DELETE",
      },
      useSession: true,
    },
    requestSchema: z.object({}),
    queryParamsSchema: z.object({}),
    responseSchema: z.object({}),
  });
}
