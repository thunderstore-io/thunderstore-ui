import { type LoaderFunctionArgs } from "react-router";

import { DapperTs } from "@thunderstore/dapper-ts";
import { ApiError, type GenericApiError } from "@thunderstore/thunderstore-api";

import { getSessionTools } from "cyberstorm/security/publicEnvVariables";

export function makeTeamSettingsTabLoader<T>(
  dataFetcher: (dapper: DapperTs, teamName: string) => Promise<T>
) {
  return async function clientLoader({ params }: LoaderFunctionArgs) {
    const teamName = params.namespaceId!;

    try {
      const dapper = setupDapper();
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

const setupDapper = () => {
  const tools = getSessionTools();
  const config = tools?.getConfig();
  return new DapperTs(() => ({
    apiHost: config?.apiHost,
    sessionId: config?.sessionId,
  }));
};
