import { TabFetchState } from "app/p/components/TabFetchState/TabFetchState";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { getApiHostForSsr } from "cyberstorm/utils/env";
import { createSeo } from "cyberstorm/utils/meta";
import { ssrLoader } from "cyberstorm/utils/ssrLoader";
import { Suspense } from "react";
import { Await, useLoaderData } from "react-router";

import { SkeletonBox } from "@thunderstore/cyberstorm";
import { DapperTs } from "@thunderstore/dapper-ts";

import type { Route } from "./+types/PackageVersionVersions";
import { VersionsTable } from "./VersionsTable";

export const loader = ssrLoader(
  async ({ params }: Route.LoaderArgs) => {
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
  },
  { cache: true }
);

export { forwardLoaderHeaders as headers } from "cyberstorm/utils/ssrLoader";

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
          <VersionsTable
            versions={resolvedValue}
            communityId={communityId}
            namespaceId={namespaceId}
            packageId={packageId}
          />
        )}
      </Await>
    </Suspense>
  );
}
