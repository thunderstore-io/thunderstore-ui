import { type LoaderFunctionArgs } from "react-router";
import { useLoaderData, useRouteError } from "react-router";
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
import { resolveRouteErrorPayload } from "cyberstorm/utils/errors/resolveRouteErrorPayload";
import { Heading } from "@thunderstore/cyberstorm";

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

export function clientLoader({ params, request }: LoaderFunctionArgs) {
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
    const listingPromise = dapper
      .getPackageListingDetails(
        params.communityId,
        params.namespaceId,
        params.packageId
      )
      .catch((error) =>
        handleLoaderError(error, { mappings: packageDependenciesErrorMappings })
      );

    const version = listingPromise.then((listing) =>
      dapper
        .getPackageVersionDetails(
          params.namespaceId,
          params.packageId,
          listing.latest_version_number
        )
        .catch((error) =>
          handleLoaderError(error, {
            mappings: packageDependenciesErrorMappings,
          })
        )
    );

    const dependencies = listingPromise.then((listing) =>
      dapper
        .getPackageVersionDependencies(
          params.namespaceId,
          params.packageId,
          listing.latest_version_number,
          page === null ? undefined : Number(page)
        )
        .catch((error) =>
          handleLoaderError(error, {
            mappings: packageDependenciesErrorMappings,
          })
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
  const error = useRouteError();
  const payload = resolveRouteErrorPayload(error);

  return (
    <div className="package-listing__error">
      <Heading csLevel="3" csSize="3" csVariant="primary" mode="display">
        {payload.headline}
      </Heading>
      {payload.description ? (
        <p className="package-listing__error-description">
          {payload.description}
        </p>
      ) : null}
    </div>
  );
}
