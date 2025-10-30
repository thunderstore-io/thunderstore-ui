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
import { packageDependenciesErrorMappings } from "./Required";
import { resolveRouteErrorPayload } from "cyberstorm/utils/errors/resolveRouteErrorPayload";
import { Heading } from "@thunderstore/cyberstorm";

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

export function clientLoader({ params, request }: LoaderFunctionArgs) {
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

    const version = dapper
      .getPackageVersionDetails(
        params.namespaceId,
        params.packageId,
        params.packageVersion
      )
      .catch((error) =>
        handleLoaderError(error, { mappings: packageDependenciesErrorMappings })
      );
    const dependencies = dapper
      .getPackageVersionDependencies(
        params.namespaceId,
        params.packageId,
        params.packageVersion,
        page === null ? undefined : Number(page)
      )
      .catch((error) =>
        handleLoaderError(error, { mappings: packageDependenciesErrorMappings })
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
