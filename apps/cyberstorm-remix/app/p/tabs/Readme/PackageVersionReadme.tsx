import { TabFetchState } from "app/p/components/TabFetchState/TabFetchState";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { getApiHostForSsr } from "cyberstorm/utils/env";
import { createSeo } from "cyberstorm/utils/meta";
import { Await } from "react-router";
import { useLoaderData } from "react-router";
import { ClientSuspense } from "~/commonComponents/ClientSuspense/ClientSuspense";

import { SkeletonBox } from "@thunderstore/cyberstorm";
import { DapperTs } from "@thunderstore/dapper-ts";

import type { Route } from "./+types/PackageVersionReadme";
import "./Readme.css";

export async function loader({ params }: Route.LoaderArgs) {
  if (params.namespaceId && params.packageId && params.packageVersion) {
    const dapper = new DapperTs(() => {
      return {
        apiHost: getApiHostForSsr(),
        sessionId: undefined,
      };
    });
    return {
      readme: await dapper.getPackageReadme(
        params.namespaceId,
        params.packageId,
        params.packageVersion
      ),
      seo: createSeo({
        descriptors: [
          {
            title: `${params.namespaceId}-${params.packageId} ${params.packageVersion} Readme | Thunderstore`,
          },
          {
            name: "description",
            content: `Readme for ${params.namespaceId}-${params.packageId} ${params.packageVersion}`,
          },
        ],
      }),
    };
  }
  return {
    status: "error",
    message: "Failed to load readme",
    readme: { html: "" },
    seo: createSeo({
      descriptors: [{ title: "Readme Not Found | Thunderstore" }],
    }),
  };
}

export async function clientLoader({
  params,
  serverLoader,
}: Route.ClientLoaderArgs) {
  if (params.namespaceId && params.packageId && params.packageVersion) {
    const tools = getSessionTools();
    const dapper = new DapperTs(() => {
      return {
        apiHost: tools?.getConfig().apiHost,
        sessionId: tools?.getConfig().sessionId,
      };
    });
    return {
      readme: dapper.getPackageReadme(
        params.namespaceId,
        params.packageId,
        params.packageVersion
      ),
      seo: (await serverLoader()).seo,
    };
  }
  return {
    status: "error",
    message: "Failed to load readme",
    readme: { html: "" },
    seo: (await serverLoader()).seo,
  };
}

export default function PackageVersionReadme() {
  const { status, message, readme } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  if (status === "error") {
    return <TabFetchState variant="danger" message={message} />;
  }

  return (
    <ClientSuspense
      fallback={<SkeletonBox className="package-readme__skeleton" />}
    >
      <Await
        resolve={readme}
        errorElement={
          <TabFetchState
            variant="danger"
            message="Error occurred while loading description"
          />
        }
      >
        {(resolvedValue) =>
          resolvedValue && resolvedValue.html ? (
            <div className="markdown-wrapper">
              <div
                dangerouslySetInnerHTML={{ __html: resolvedValue.html }}
                className="markdown"
              />
            </div>
          ) : (
            <TabFetchState variant="info" message="No details available" />
          )
        }
      </Await>
    </ClientSuspense>
  );
}
