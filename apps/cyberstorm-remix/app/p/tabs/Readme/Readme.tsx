import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { getApiHostForSsr } from "cyberstorm/utils/env";
import { createSeo } from "cyberstorm/utils/meta";
import { Await } from "react-router";
import { useLoaderData } from "react-router";
import { ClientSuspense } from "~/commonComponents/ClientSuspense/ClientSuspense";

import { SkeletonBox } from "@thunderstore/cyberstorm";
import { DapperTs } from "@thunderstore/dapper-ts";
import { isApiError } from "@thunderstore/thunderstore-api";

import type { Route } from "./+types/Readme";
import "./Readme.css";

async function fetchReadmeSafe(
  dapper: DapperTs,
  namespaceId: string,
  packageId: string
) {
  try {
    return await dapper.getPackageReadme(namespaceId, packageId);
  } catch (error) {
    if (isApiError(error) && error.response.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function loader({ params }: Route.LoaderArgs) {
  if (!params.namespaceId || !params.packageId) {
    throw new Response("Not Found", { status: 404 });
  }

  const dapper = new DapperTs(() => {
    return {
      apiHost: getApiHostForSsr(),
      sessionId: undefined,
    };
  });

  return {
    readme: await fetchReadmeSafe(dapper, params.namespaceId, params.packageId),
    seo: createSeo({
      descriptors: [
        {
          title: `${params.namespaceId}-${params.packageId} Readme | Thunderstore`,
        },
        {
          name: "description",
          content: `Readme for ${params.namespaceId}-${params.packageId}`,
        },
      ],
    }),
  };
}

export async function clientLoader({
  params,
  serverLoader,
}: Route.ClientLoaderArgs) {
  if (!params.namespaceId || !params.packageId) {
    throw new Response("Not Found", { status: 404 });
  }

  const tools = getSessionTools();
  const dapper = new DapperTs(() => {
    return {
      apiHost: tools?.getConfig().apiHost,
      sessionId: tools?.getConfig().sessionId,
    };
  });

  return {
    readme: fetchReadmeSafe(dapper, params.namespaceId, params.packageId),
    seo: (await serverLoader()).seo,
  };
}

export default function Readme() {
  const { readme } = useLoaderData<typeof loader | typeof clientLoader>();

  return (
    <ClientSuspense
      fallback={<SkeletonBox className="package-readme__skeleton" />}
    >
      <Await resolve={readme}>
        {(resolvedValue) =>
          resolvedValue ? (
            <div className="markdown-wrapper">
              <div
                dangerouslySetInnerHTML={{ __html: resolvedValue.html }}
                className="markdown"
              />
            </div>
          ) : (
            <div>No details available</div>
          )
        }
      </Await>
    </ClientSuspense>
  );
}
