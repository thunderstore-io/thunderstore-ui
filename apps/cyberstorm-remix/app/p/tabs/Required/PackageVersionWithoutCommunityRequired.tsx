import { type LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { PaginatedDependencies } from "~/commonComponents/PaginatedDependencies/PaginatedDependencies";
import { throwUserFacingPayloadResponse } from "cyberstorm/utils/errors/userFacingErrorResponse";
import { handleLoaderError } from "cyberstorm/utils/errors/handleLoaderError";
import { packageDependenciesErrorMappings } from "./Required";
import { NimbusDefaultRouteErrorBoundary } from "cyberstorm/utils/errors/NimbusErrorBoundary";
import { getLoaderTools } from "cyberstorm/utils/getLoaderTools";

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId && params.packageVersion) {
    const { dapper } = getLoaderTools();
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

export function clientLoader({ params, request }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId && params.packageVersion) {
    const { dapper } = getLoaderTools();
    const searchParams = new URL(request.url).searchParams;
    const page = searchParams.get("page");

    const version = dapper.getPackageVersionDetails(
      params.namespaceId,
      params.packageId,
      params.packageVersion
    );
    const dependencies = dapper.getPackageVersionDependencies(
      params.namespaceId,
      params.packageId,
      params.packageVersion,
      page === null ? undefined : Number(page)
    );

    return {
      version,
      dependencies,
    };
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

export function ErrorBoundary() {
  return <NimbusDefaultRouteErrorBoundary />;
}
