import { Suspense } from "react";
import { type LoaderFunctionArgs } from "react-router";
import { useLoaderData, Await } from "react-router";
import { DapperTs } from "@thunderstore/dapper-ts";
import { SkeletonBox } from "@thunderstore/cyberstorm";
import { PaginatedDependencies } from "~/commonComponents/PaginatedDependencies/PaginatedDependencies";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId && params.packageVersion) {
    const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
    const dapper = new DapperTs(() => {
      return {
        apiHost: publicEnvVariables.VITE_API_URL,
        sessionId: undefined,
      };
    });
    const searchParams = new URL(request.url).searchParams;
    const page = searchParams.get("page");

    return {
      version: await dapper.getPackageVersionDetails(
        params.namespaceId,
        params.packageId,
        params.packageVersion
      ),
      dependencies: await dapper.getPackageVersionDependencies(
        params.namespaceId,
        params.packageId,
        params.packageVersion,
        page === null ? undefined : Number(page)
      ),
    };
  }
  throw new Response("Package version dependencies not found", { status: 404 });
}

export async function clientLoader({ params, request }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId && params.packageVersion) {
    const tools = getSessionTools();
    const dapper = new DapperTs(() => {
      return {
        apiHost: tools?.getConfig().apiHost,
        sessionId: tools?.getConfig().sessionId,
      };
    });
    const searchParams = new URL(request.url).searchParams;
    const page = searchParams.get("page");

    return {
      version: dapper.getPackageVersionDetails(
        params.namespaceId,
        params.packageId,
        params.packageVersion
      ),
      dependencies: dapper.getPackageVersionDependencies(
        params.namespaceId,
        params.packageId,
        params.packageVersion,
        page === null ? undefined : Number(page)
      ),
    };
  }
  throw new Response("Package version dependencies not found", { status: 404 });
}

export default function PackageVersionWithoutCommunityRequired() {
  const { dependencies } = useLoaderData();

  return (
    <Suspense
      fallback={<SkeletonBox className="paginated-dependencies__skeleton" />}
    >
      <Await
        resolve={dependencies}
        errorElement={
          <div>Error occurred while loading required dependencies</div>
        }
      >
        {(resolvedDependencies) => (
          <PaginatedDependencies dependencies={resolvedDependencies} />
        )}
      </Await>
    </Suspense>
  );
}
