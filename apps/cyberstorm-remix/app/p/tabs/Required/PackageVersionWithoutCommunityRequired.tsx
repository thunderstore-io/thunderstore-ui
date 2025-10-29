import { type LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { DapperTs } from "@thunderstore/dapper-ts";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { PaginatedDependencies } from "~/commonComponents/PaginatedDependencies/PaginatedDependencies";
import { throwUserFacingPayloadResponse } from "cyberstorm/utils/errors/userFacingErrorResponse";
import { handleLoaderError } from "cyberstorm/utils/errors/handleLoaderError";
import { packageDependenciesErrorMappings } from "./Required";

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId && params.packageVersion) {
    const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
    const dapper = new DapperTs(() => {
      return {
        apiHost: publicEnvVariables.VITE_API_URL,
        sessionId: undefined,
      };
    });
    const searchParams = new URL(request.url).searchParams;
    const page = searchParams.get("page");

    try {
      const version = await dapper.getPackageVersionDetails(
        params.namespaceId,
        params.packageId,
        params.packageVersion
      );
      const dependencies = await dapper.getPackageVersionDependencies(
        params.namespaceId,
        params.packageId,
        params.packageVersion,
        page === null ? undefined : Number(page)
      );

      return {
        version,
        dependencies,
      };
    } catch (error) {
      handleLoaderError(error, { mappings: packageDependenciesErrorMappings });
    }
  }
  throwUserFacingPayloadResponse({
    headline: "Dependencies not found.",
    description: "We could not find the requested version dependencies.",
    category: "not_found",
    status: 404,
  });
}

export async function clientLoader({ params, request }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId && params.packageVersion) {
    const tools = getSessionTools();
    const dapper = new DapperTs(() => {
      return {
        apiHost: tools?.getConfig().apiHost,
        sessionId: tools?.getConfig().sessionId,
      };
    });
    const searchParams = new URL(request.url).searchParams;
    const page = searchParams.get("page");

    try {
      const versionPromise = dapper.getPackageVersionDetails(
        params.namespaceId,
        params.packageId,
        params.packageVersion
      );
      const dependenciesPromise = dapper.getPackageVersionDependencies(
        params.namespaceId,
        params.packageId,
        params.packageVersion,
        page === null ? undefined : Number(page)
      );

      await Promise.all([versionPromise, dependenciesPromise]);

      return {
        version: versionPromise,
        dependencies: dependenciesPromise,
      };
    } catch (error) {
      handleLoaderError(error, { mappings: packageDependenciesErrorMappings });
    }
  }
  throwUserFacingPayloadResponse({
    headline: "Dependencies not found.",
    description: "We could not find the requested version dependencies.",
    category: "not_found",
    status: 404,
  });
}

export default function PackageVersionWithoutCommunityRequired() {
  const { version, dependencies } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  return (
    <PaginatedDependencies version={version} dependencies={dependencies} />
  );
}
