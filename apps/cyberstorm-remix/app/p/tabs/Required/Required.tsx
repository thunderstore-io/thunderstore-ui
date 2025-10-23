import { type LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { PaginatedDependencies } from "~/commonComponents/PaginatedDependencies/PaginatedDependencies";
import { throwUserFacingPayloadResponse } from "cyberstorm/utils/errors/userFacingErrorResponse";
import { handleLoaderError } from "cyberstorm/utils/errors/handleLoaderError";
import { createNotFoundMapping } from "cyberstorm/utils/errors/loaderMappings";
import { NimbusDefaultRouteErrorBoundary } from "cyberstorm/utils/errors/NimbusErrorBoundary";
import { getLoaderTools } from "cyberstorm/utils/getLoaderTools";

export const packageDependenciesErrorMappings = [
  createNotFoundMapping(
    "Dependencies not found.",
    "We could not find the requested version dependencies."
  ),
];

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    const { dapper } = getLoaderTools();
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

export function clientLoader({ params, request }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    const { dapper } = getLoaderTools();
    const searchParams = new URL(request.url).searchParams;
    const page = searchParams.get("page");
    const listingPromise = dapper.getPackageListingDetails(
      params.communityId,
      params.namespaceId,
      params.packageId
    );

    const version = listingPromise.then((listing) =>
      dapper.getPackageVersionDetails(
        listing.namespace,
        listing.name,
        listing.latest_version_number
      )
    );

    const dependencies = listingPromise.then((listing) =>
      dapper.getPackageVersionDependencies(
        listing.namespace,
        listing.name,
        listing.latest_version_number,
        page === null ? undefined : Number(page)
      )
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

export default function PackageVersionRequired() {
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
