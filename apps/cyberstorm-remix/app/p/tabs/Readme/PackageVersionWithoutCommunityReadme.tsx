import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { Suspense } from "react";
import { Await, type LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";

import { SkeletonBox } from "@thunderstore/cyberstorm";
import { DapperTs } from "@thunderstore/dapper-ts";

import "./Readme.css";

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId && params.packageVersion) {
    const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
    const dapper = new DapperTs(() => {
      return {
        apiHost: publicEnvVariables.VITE_API_URL,
        sessionId: undefined,
      };
    });
    return {
      readme: await dapper.getPackageReadme(
        params.namespaceId,
        params.packageId,
        params.packageVersion
      ),
    };
  }
  return {
    status: "error",
    message: "Failed to load readme",
    readme: { html: "" },
  };
}

export async function clientLoader({ params }: LoaderFunctionArgs) {
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
    };
  }
  return {
    status: "error",
    message: "Failed to load readme",
    readme: { html: "" },
  };
}

export default function PackageVersionReadme() {
  const { status, message, readme } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  if (status === "error") return <div>{message}</div>;
  return (
    <Suspense fallback={<SkeletonBox className="package-readme__skeleton" />}>
      <Await
        resolve={readme}
        errorElement={<div>Error occurred while loading description</div>}
      >
        {(resolvedValue) => (
          <>
            <div className="markdown-wrapper">
              <div
                dangerouslySetInnerHTML={{ __html: resolvedValue.html }}
                className="markdown"
              />
            </div>
          </>
        )}
      </Await>
    </Suspense>
  );
}
