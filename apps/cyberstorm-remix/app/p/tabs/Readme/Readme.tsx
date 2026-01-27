import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { Suspense } from "react";
import { Await, type LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";

import { SkeletonBox } from "@thunderstore/cyberstorm";
import { DapperTs } from "@thunderstore/dapper-ts";
import { isApiError } from "@thunderstore/thunderstore-api";

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

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.namespaceId || !params.packageId) {
    throw new Response("Not Found", { status: 404 });
  }

  const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
  const dapper = new DapperTs(() => {
    return {
      apiHost: publicEnvVariables.VITE_API_URL,
      sessionId: undefined,
    };
  });

  return {
    readme: await fetchReadmeSafe(dapper, params.namespaceId, params.packageId),
  };
}

export async function clientLoader({ params }: LoaderFunctionArgs) {
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
    </Suspense>
  );
}
