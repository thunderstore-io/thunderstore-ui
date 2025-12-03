import "./Versions.css";
import {
  NewTableSort,
  NewTable,
  type NewTableLabels,
  Heading,
  SkeletonBox,
  NewLink,
} from "@thunderstore/cyberstorm";
import { Await, type LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { Suspense } from "react";
import { DownloadLink, InstallLink, ModManagerBanner } from "./common";
import { rowSemverCompare } from "cyberstorm/utils/semverCompare";
import { handleLoaderError } from "cyberstorm/utils/errors/handleLoaderError";
import { createNotFoundMapping } from "cyberstorm/utils/errors/loaderMappings";
import { throwUserFacingPayloadResponse } from "cyberstorm/utils/errors/userFacingErrorResponse";
import {
  NimbusAwaitErrorElement,
  NimbusDefaultRouteErrorBoundary,
} from "cyberstorm/utils/errors/NimbusErrorBoundary";
import { getLoaderTools } from "cyberstorm/utils/getLoaderTools";

export const packageVersionsErrorMappings = [
  createNotFoundMapping(
    "Package not found.",
    "We could not find the requested package."
  ),
];

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    const { dapper } = getLoaderTools();
    try {
      const versions = await dapper.getPackageVersions(
        params.namespaceId,
        params.packageId
      );

      return {
        communityId: params.communityId,
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
  if (params.communityId && params.namespaceId && params.packageId) {
    const { dapper } = getLoaderTools();
    const versions = dapper.getPackageVersions(
      params.namespaceId,
      params.packageId
    );

    return {
      communityId: params.communityId,
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
  const { communityId, namespaceId, packageId, versions } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  return (
    <Suspense fallback={<SkeletonBox className="package-versions__skeleton" />}>
      <Await resolve={versions} errorElement={<NimbusAwaitErrorElement />}>
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
                        linkId="PackageVersion"
                        package={packageId}
                        community={communityId}
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
  return <NimbusDefaultRouteErrorBoundary />;
}

export const columns: NewTableLabels = [
  {
    value: "Version",
    disableSort: false,
    columnClasses: "package-versions__version",
  },
  {
    value: "Upload date",
    disableSort: false,
    columnClasses: "package-versions__upload-date",
  },
  {
    value: "Downloads",
    disableSort: false,
    columnClasses: "package-versions__downloads",
  },
  { value: "Actions", disableSort: true },
];
