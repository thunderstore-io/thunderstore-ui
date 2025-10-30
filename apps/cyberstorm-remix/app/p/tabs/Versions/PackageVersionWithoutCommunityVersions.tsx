import "./Versions.css";
import {
  NewTableSort,
  NewTable,
  Heading,
  SkeletonBox,
  NewLink,
} from "@thunderstore/cyberstorm";
import { Await, type LoaderFunctionArgs } from "react-router";
import { useLoaderData, useRouteError } from "react-router";
import { DapperTs } from "@thunderstore/dapper-ts";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { Suspense } from "react";
import { DownloadLink, InstallLink, ModManagerBanner } from "./common";
import { rowSemverCompare } from "cyberstorm/utils/semverCompare";
import { columns, packageVersionsErrorMappings } from "./Versions";
import { handleLoaderError } from "cyberstorm/utils/errors/handleLoaderError";
import { throwUserFacingPayloadResponse } from "cyberstorm/utils/errors/userFacingErrorResponse";
import { resolveRouteErrorPayload } from "cyberstorm/utils/errors/resolveRouteErrorPayload";

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId) {
    const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
    const dapper = new DapperTs(() => {
      return {
        apiHost: publicEnvVariables.VITE_API_URL,
        sessionId: undefined,
      };
    });
    try {
      const versions = await dapper.getPackageVersions(
        params.namespaceId,
        params.packageId
      );

      return {
        namespaceId: params.namespaceId,
        packageId: params.packageId,
        versions,
      };
    } catch (error) {
      handleLoaderError(error, { mappings: packageVersionsErrorMappings });
    }
  }
  throwUserFacingPayloadResponse({
    headline: "Package not found.",
    description: "We could not find the requested package.",
    category: "not_found",
    status: 404,
  });
}

export function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId) {
    const tools = getSessionTools();
    const dapper = new DapperTs(() => {
      return {
        apiHost: tools?.getConfig().apiHost,
        sessionId: tools?.getConfig().sessionId,
      };
    });
    const versions = dapper
      .getPackageVersions(params.namespaceId, params.packageId)
      .catch((error) =>
        handleLoaderError(error, { mappings: packageVersionsErrorMappings })
      );

    return {
      namespaceId: params.namespaceId,
      packageId: params.packageId,
      versions,
    };
  }
  throwUserFacingPayloadResponse({
    headline: "Package not found.",
    description: "We could not find the requested package.",
    category: "not_found",
    status: 404,
  });
}

export default function Versions() {
  const { namespaceId, packageId, versions } =
    useLoaderData<typeof loader | typeof clientLoader>();

  return (
    <Suspense fallback={<SkeletonBox className="package-versions__skeleton" />}>
      <Await resolve={versions}>
        {(resolvedValue) => (
          <div className="package-versions">
            <ModManagerBanner />
            <div className="package-versions__table-wrapper">
              <NewTable
                titleRowContent={
                  <Heading csSize="3" csLevel="3">
                    Versions
                  </Heading>
                }
                headers={columns}
                rows={resolvedValue.map((v) => [
                  {
                    value: (
                      <NewLink
                        primitiveType="cyberstormLink"
                        linkId="PackageVersionWithoutCommunity"
                        package={packageId}
                        namespace={namespaceId}
                        version={v.version_number}
                        csVariant="cyber"
                      >
                        {v.version_number}
                      </NewLink>
                    ),
                    sortValue: v.version_number,
                  },
                  {
                    value: new Date(v.datetime_created).toUTCString(),
                    sortValue: v.datetime_created,
                  },
                  {
                    value: v.download_count.toLocaleString(),
                    sortValue: v.download_count,
                  },
                  {
                    value: (
                      <div className="package-versions__actions">
                        <DownloadLink {...v} />
                        <InstallLink {...v} />
                      </div>
                    ),
                    sortValue: 0,
                  },
                ])}
                sortDirection={NewTableSort.DESC}
                csModifiers={["alignLastColumnRight"]}
                customSortCompare={{ 0: rowSemverCompare }}
              />
            </div>
          </div>
        )}
      </Await>
    </Suspense>
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
