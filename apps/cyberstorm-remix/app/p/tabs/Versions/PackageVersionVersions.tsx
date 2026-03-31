import { TabFetchState } from "app/p/components/TabFetchState/TabFetchState";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { getApiHostForSsr } from "cyberstorm/utils/env";
import { createSeo } from "cyberstorm/utils/meta";
import { rowSemverCompare } from "cyberstorm/utils/semverCompare";
import { Suspense } from "react";
import { Await } from "react-router";
import { useLoaderData } from "react-router";

import {
  Heading,
  NewLink,
  NewTable,
  NewTableSort,
  SkeletonBox,
} from "@thunderstore/cyberstorm";
import { DapperTs } from "@thunderstore/dapper-ts";

import type { Route } from "./+types/PackageVersionVersions";
import { columns } from "./Versions";
import "./Versions.css";
import { DownloadLink, InstallLink, ModManagerBanner } from "./common";

export async function loader({ params }: Route.LoaderArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    const dapper = new DapperTs(() => {
      return {
        apiHost: getApiHostForSsr(),
        sessionId: undefined,
      };
    });
    return {
      communityId: params.communityId,
      namespaceId: params.namespaceId,
      packageId: params.packageId,
      versions: await dapper.getPackageVersions(
        params.namespaceId,
        params.packageId
      ),
      seo: createSeo({
        descriptors: [
          {
            title: `${params.namespaceId}-${params.packageId} Versions | Thunderstore - The ${params.communityId} Mod Database`,
          },
          {
            name: "description",
            content: `Versions for ${params.namespaceId}-${params.packageId}`,
          },
        ],
      }),
    };
  }
  return {
    status: "error",
    message: "Failed to load versions",
    versions: [],
    seo: createSeo({ descriptors: [{ title: "Versions Not Found" }] }),
  };
}

export async function clientLoader({
  params,
  serverLoader,
}: Route.ClientLoaderArgs) {
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
      seo: (await serverLoader()).seo,
    };
  }
  return {
    status: "error",
    message: "Failed to load versions",
    versions: [],
    seo: (await serverLoader()).seo,
  };
}

export default function Versions() {
  const { communityId, namespaceId, packageId, status, message, versions } =
    useLoaderData<typeof loader | typeof clientLoader>();

  if (status === "error") {
    return <TabFetchState variant="danger" message={message} />;
  }

  return (
    <Suspense fallback={<SkeletonBox className="package-versions__skeleton" />}>
      <Await
        resolve={versions}
        errorElement={
          <TabFetchState
            variant="danger"
            message="Error occurred while loading versions"
          />
        }
      >
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
                        csVariant="primary"
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
