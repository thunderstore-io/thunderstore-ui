import { type LoaderFunctionArgs } from "react-router";
import { DapperTs } from "@thunderstore/dapper-ts";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { ApiError, type GenericApiError } from "@thunderstore/thunderstore-api";
import { throwUserFacingPayloadResponse } from "cyberstorm/utils/errors/userFacingErrorResponse";

export function getLoaderTools() {
  let dapper: DapperTs;
  let sessionTools: ReturnType<typeof getSessionTools> | undefined;
  if (import.meta.env.SSR) {
    const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
    dapper = new DapperTs(() => {
      return {
        apiHost: publicEnvVariables.VITE_API_URL,
        sessionId: undefined,
      };
    });
  } else {
    sessionTools = getSessionTools();
    const sessionConfig = sessionTools?.getConfig();
    dapper = new DapperTs(() => {
      return {
        apiHost: sessionConfig?.apiHost,
        sessionId: sessionConfig?.sessionId,
      };
    });
  }
  return { dapper, sessionTools };
}

export function makeTeamSettingsTabLoader<T>(
  dataFetcher: (dapper: DapperTs, teamName: string) => Promise<T>
) {
  return async function clientLoader({ params }: LoaderFunctionArgs) {
    const teamName = params.namespaceId;
    if (!teamName) {
      throwUserFacingPayloadResponse({
        headline: "Team not found.",
        description: "We could not find the requested team.",
        category: "not_found",
        status: 404,
      });
    }

    try {
      const { dapper } = getLoaderTools();
      const data = await dataFetcher(dapper, teamName);
      return { teamName, ...data };
    } catch (error) {
      if (error instanceof ApiError) {
        const status = error.response.status;
        const statusText =
          (error.responseJson as GenericApiError)?.detail ??
          error.response.statusText;
        throw new Response(statusText, { status, statusText });
      }
      throw error;
    }
  };
}
