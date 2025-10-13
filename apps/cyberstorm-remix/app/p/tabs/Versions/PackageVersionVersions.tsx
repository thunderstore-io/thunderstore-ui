import "./Versions.css";
import {
  NewTableSort,
  NewTable,
  Heading,
  SkeletonBox,
  NewLink,
} from "@thunderstore/cyberstorm";
import { Await, type LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { DapperTs } from "@thunderstore/dapper-ts";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { Suspense } from "react";
import { DownloadLink, InstallLink, ModManagerBanner } from "./common";
import { rowSemverCompare } from "cyberstorm/utils/semverCompare";
import { columns } from "./Versions";

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
    const dapper = new DapperTs(() => {
      return {
        apiHost: publicEnvVariables.VITE_API_URL,
        sessionId: undefined,
      };
    });
    return {
      communityId: params.communityId,
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
  if (params.communityId && params.namespaceId && params.packageId) {
    const tools = getSessionTools();
    const dapper = new DapperTs(() => {
      return {
        apiHost: tools?.getConfig().apiHost,
        sessionId: tools?.getConfig().sessionId,
      };
    });
    return {
      communityId: params.communityId,
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
  const { communityId, namespaceId, packageId, status, message, versions } =
    useLoaderData<typeof loader | typeof clientLoader>();

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
