import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { type LoaderFunctionArgs } from "react-router";

import { DapperTs } from "@thunderstore/dapper-ts";
import { ApiError, type GenericApiError } from "@thunderstore/thunderstore-api";

/**
 * TODO
 * 1) This approach no longer handles different ApiErrors properly
 *    when the data isn't awaited in the clientLoader but returned as
 *    promises for the Suspense/Await elements to handle. Instead, any
 *    HTTP error codes are shown as 500 errors. This isn't fixed yet
 *    as it will be easier to do once upcoming project wide error
 *    handling changes are merged.
 * 2) The purpose of this helper was to reduce boilerplate in different
 *    tab components of the team settings page. Half of that boilerplate
 *    is Dapper setup, the other is handling ApiErrors. As the latter is
 *    supposed to be handled elsewhere after the changes mentioned above,
 *    this helper might no longer have a valid reason to exist after the
 *    changes.
 */
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
