import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { getApiHostForSsr } from "cyberstorm/utils/env";
import { Suspense } from "react";
import { Await, useLoaderData } from "react-router";
import { type LoaderFunctionArgs } from "react-router";

import { SkeletonBox } from "@thunderstore/cyberstorm";
import { DapperTs } from "@thunderstore/dapper-ts";
import { isApiError } from "@thunderstore/thunderstore-api";

import "./Changelog.css";

async function fetchChangelogSafe(
  dapper: DapperTs,
  namespaceId: string,
  packageId: string
) {
  try {
    return await dapper.getPackageChangelog(namespaceId, packageId);
  } catch (error) {
    if (isApiError(error) && error.response.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.namespaceId || !params.packageId) {
    throw new Response("Not Found", { status: 404 });
  }

  const dapper = new DapperTs(() => ({
    apiHost: getApiHostForSsr(),
    sessionId: undefined,
  }));

  const changelog = await fetchChangelogSafe(
    dapper,
    params.namespaceId,
    params.packageId
  );

  return { changelog };
}

export function clientLoader({ params }: LoaderFunctionArgs) {
  if (!params.namespaceId || !params.packageId) {
    throw new Response("Not Found", { status: 404 });
  }

  const tools = getSessionTools();
  const dapper = new DapperTs(() => ({
    apiHost: tools?.getConfig().apiHost,
    sessionId: tools?.getConfig().sessionId,
  }));

  return {
    changelog: fetchChangelogSafe(dapper, params.namespaceId, params.packageId),
  };
}

export default function Changelog() {
  const { changelog } = useLoaderData<typeof loader | typeof clientLoader>();

  return (
    <Suspense
      fallback={<SkeletonBox className="package-changelog__skeleton" />}
    >
      <Await resolve={changelog}>
        {(resolvedValue) =>
          resolvedValue ? (
            <div className="markdown-wrapper">
              <div
                dangerouslySetInnerHTML={{ __html: resolvedValue.html }}
                className="markdown"
              />
            </div>
          ) : (
            <div>No changelog available</div>
          )
        }
      </Await>
    </Suspense>
  );
}
