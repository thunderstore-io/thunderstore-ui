import { FetchErrorState } from "app/commonComponents/FetchErrorState/FetchErrorState";
import { TabFetchState } from "app/p/components/TabFetchState/TabFetchState";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { getApiHostForSsr } from "cyberstorm/utils/env";
import { ssrLoader } from "cyberstorm/utils/ssrLoader";
import { Suspense } from "react";
import { Await } from "react-router";
import { useLoaderData } from "react-router";

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

export const loader = ssrLoader(
  async ({ params }: Route.LoaderArgs) => {
    if (!params.namespaceId || !params.packageId) {
      throw new Response("Not Found", { status: 404 });
    }

    const dapper = new DapperTs(() => {
      return {
        apiHost: getApiHostForSsr(),
        sessionId: undefined,
      };
    });

    // No SEO here: the default tab inherits the parent packageListing's canonical
    // title + real description. Overriding it templated the meta description that
    // search engines snippet from (TS-3390).
    return {
      readme: await fetchReadmeSafe(
        dapper,
        params.namespaceId,
        params.packageId
      ),
    };
  },
  { cache: true }
);

export { forwardLoaderHeaders as headers } from "cyberstorm/utils/ssrLoader";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
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
  };
}

export default function Readme() {
  const { readme } = useLoaderData<typeof loader | typeof clientLoader>();

  return (
    <Suspense fallback={<SkeletonBox className="package-readme__skeleton" />}>
      <Await
        resolve={readme}
        errorElement={<FetchErrorState message="Failed to load readme." />}
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
    </Suspense>
  );
}
