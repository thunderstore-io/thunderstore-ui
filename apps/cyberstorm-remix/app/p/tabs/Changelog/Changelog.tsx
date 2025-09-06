import { Await, useLoaderData } from "react-router";
import { LoaderFunctionArgs } from "react-router";
import { DapperTs } from "@thunderstore/dapper-ts";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { SkeletonBox } from "@thunderstore/cyberstorm";
import { Suspense } from "react";
import "./Changelog.css";

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId) {
    const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
    const dapper = new DapperTs(() => {
      return {
        apiHost: publicEnvVariables.VITE_API_URL,
        sessionId: undefined,
      };
    });
    return {
      changelog: dapper.getPackageChangelog(
        params.namespaceId,
        params.packageId
      ),
    };
  }
  return {
    status: "error",
    message: "Failed to load changelog",
    changelog: { html: "" },
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
      changelog: dapper.getPackageChangelog(
        params.namespaceId,
        params.packageId
      ),
    };
  }
  return {
    status: "error",
    message: "Failed to load changelog",
    changelog: { html: "" },
  };
}

export default function Changelog() {
  const { status, message, changelog } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  if (status === "error") return <div>{message}</div>;
  return (
    <Suspense
      fallback={<SkeletonBox className="package-changelog__skeleton" />}
    >
      <Await
        resolve={changelog}
        errorElement={<div>Error occurred while loading changelog</div>}
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
