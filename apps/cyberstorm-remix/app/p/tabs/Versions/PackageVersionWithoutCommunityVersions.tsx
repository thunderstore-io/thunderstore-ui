import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { getApiHostForSsr } from "cyberstorm/utils/env";
import { rowSemverCompare } from "cyberstorm/utils/semverCompare";
import { Suspense } from "react";
import { Await, type LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";

import {
  Heading,
  NewLink,
  NewTable,
  NewTableSort,
  SkeletonBox,
} from "@thunderstore/cyberstorm";
import { DapperTs } from "@thunderstore/dapper-ts";

import { columns } from "./Versions";
import "./Versions.css";
import { DownloadLink, InstallLink, ModManagerBanner } from "./common";

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId) {
    const dapper = new DapperTs(() => {
      return {
        apiHost: getApiHostForSsr(),
        sessionId: undefined,
      };
    });
    return {
      namespaceId: params.namespaceId,
      packageId: params.packageId,
      versions: dapper.getPackageVersions(params.namespaceId, params.packageId),
    };
  }
  return {
    status: "error",
    message: "Failed to load versions",
    versions: [],
  };
}

export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId) {
    const tools = getSessionTools();
    const dapper = new DapperTs(() => {
      return {
        apiHost: tools?.getConfig().apiHost,
        sessionId: tools?.getConfig().sessionId,
      };
    });
    return {
      namespaceId: params.namespaceId,
      packageId: params.packageId,
      versions: dapper.getPackageVersions(params.namespaceId, params.packageId),
    };
  }
  return {
    status: "error",
    message: "Failed to load versions",
    versions: [],
  };
}

export default function Versions() {
  const { namespaceId, packageId, status, message, versions } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  if (status === "error") {
    return <div>{message}</div>;
  }

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
