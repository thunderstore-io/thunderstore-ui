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
import {
  FORBIDDEN_MAPPING,
  SIGN_IN_REQUIRED_MAPPING,
  VALIDATION_MAPPING,
  createNotFoundMapping,
} from "cyberstorm/utils/errors/loaderMappings";

export const packageDependenciesErrorMappings = [
  SIGN_IN_REQUIRED_MAPPING,
  FORBIDDEN_MAPPING,
  VALIDATION_MAPPING,
  createNotFoundMapping(
    "Dependencies not found.",
    "We could not find the requested version dependencies."
  ),
];

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
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
      const listing = await dapper.getPackageListingDetails(
        params.communityId,
        params.namespaceId,
        params.packageId
      );

      const version = await dapper.getPackageVersionDetails(
        params.namespaceId,
        params.packageId,
        listing.latest_version_number
      );
      const dependencies = await dapper.getPackageVersionDependencies(
        params.namespaceId,
        params.packageId,
        listing.latest_version_number,
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
  if (params.communityId && params.namespaceId && params.packageId) {
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
      const listing = await dapper.getPackageListingDetails(
        params.communityId,
        params.namespaceId,
        params.packageId
      );

      const versionPromise = dapper.getPackageVersionDetails(
        params.namespaceId,
        params.packageId,
        listing.latest_version_number
      );
      const dependenciesPromise = dapper.getPackageVersionDependencies(
        params.namespaceId,
        params.packageId,
        listing.latest_version_number,
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

export default function PackageVersionRequired() {
  const { version, dependencies } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  return (
    <PaginatedDependencies version={version} dependencies={dependencies} />
  );
}
