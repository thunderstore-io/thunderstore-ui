import { Await, type LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { DapperTs } from "@thunderstore/dapper-ts";
import { getPublicEnvVariables } from "cyberstorm/security/publicEnvVariables";
import { Suspense } from "react";
import { SkeletonBox } from "@thunderstore/cyberstorm";
import "./Readme.css";
import { getRequestScopedDapper } from "cyberstorm/utils/dapperSingleton";

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
    const dapper = new DapperTs(() => {
      return {
        apiHost: publicEnvVariables.VITE_API_URL,
        sessionId: undefined,
      };
    });
    const community = await dapper.getCommunity(params.communityId);
    return {
      readme: dapper.getPackageReadme(params.namespaceId, params.packageId),
      community: community,
    };
  }
  return {
    status: "error",
    message: "Failed to load readme",
    readme: { html: "" },
  };
}

export async function clientLoader({ params, request }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    const dapper = getRequestScopedDapper(request);
    const community = dapper.getCommunity(params.communityId);
    return {
      readme: dapper.getPackageReadme(params.namespaceId, params.packageId),
      community,
    };
  }
  return {
    status: "error",
    message: "Failed to load readme",
    readme: { html: "" },
  };
}

export default function Readme() {
  const { status, message, readme, community } = useLoaderData<
    typeof loader | typeof clientLoader
  >();
  console.log(community);

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
