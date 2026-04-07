import { PaginatedDependencies } from "app/commonComponents/PaginatedDependencies/PaginatedDependencies";
import { TabFetchState } from "app/p/components/TabFetchState/TabFetchState";
import { getPrivateListing, getPublicListing } from "app/p/listingUtils";
import { getDapperForRequest } from "cyberstorm/utils/dapperSingleton";
import { getApiHostForSsr } from "cyberstorm/utils/env";
import { createSeo } from "cyberstorm/utils/meta";
import { Suspense } from "react";
import { Await, useLoaderData } from "react-router";

import { SkeletonBox } from "@thunderstore/cyberstorm";
import { DapperTs } from "@thunderstore/dapper-ts";

import type { Route } from "./+types/Required";

const Dependency404 = new Response("Package dependencies not found", {
  status: 404,
});

const getPageFromUrl = (url: string): number | undefined => {
  const searchParams = new URL(url).searchParams;
  const maybePage = searchParams.get("page");
  return maybePage ? Number(maybePage) : undefined;
};

export async function loader({ params, request }: Route.LoaderArgs) {
  const { communityId, namespaceId, packageId, packageVersion } = params;

  // Either communityId or packageVersion is required depending on route.
  if (!namespaceId || !packageId || (!communityId && !packageVersion)) {
    throw Dependency404;
  }

  const dapper = new DapperTs(() => ({
    apiHost: getApiHostForSsr(),
    sessionId: undefined,
  }));

  let version: string;

  if (packageVersion) {
    version = packageVersion;
  } else if (communityId) {
    const listingArgs = { communityId, namespaceId, packageId };
    const listing = await getPublicListing(dapper, listingArgs);

    // Listing that's not available on unauthenticated SSR request
    // might be available for authenticated user on client. Return
    // undefined rather than throw error to allow refetch on client.
    if (!listing) {
      return { dependencies: undefined, seo: createSeo({ descriptors: [] }) };
    }

    version = listing.latest_version_number;
  } else {
    throw Dependency404; // Can't happen, satisfies TypeScript
  }

  return {
    communityId: communityId,
    dependencies: await dapper.getPackageVersionDependencies(
      namespaceId,
      packageId,
      version,
      getPageFromUrl(request.url)
    ),
    seo: createSeo({
      descriptors: [
        { title: `${namespaceId}-${packageId} Dependencies | Thunderstore` },
        {
          name: "description",
          content: `Dependencies for ${namespaceId}-${packageId}`,
        },
      ],
    }),
  };
}

export async function clientLoader({
  params,
  request,
  serverLoader,
}: Route.ClientLoaderArgs) {
  const { communityId, namespaceId, packageId, packageVersion } = params;

  // Either communityId or packageVersion is required depending on route.
  if (!namespaceId || !packageId || (!communityId && !packageVersion)) {
    throw Dependency404;
  }

  const dapper = getDapperForRequest(request);
  let version: string;

  if (packageVersion) {
    version = packageVersion;
  } else if (communityId) {
    const listingArgs = { communityId, namespaceId, packageId };
    const listing = await getPrivateListing(dapper, listingArgs);
    version = listing.latest_version_number;
  } else {
    throw Dependency404; // Can't happen, satisfies TypeScript
  }

  return {
    communityId: communityId,
    dependencies: dapper.getPackageVersionDependencies(
      namespaceId,
      packageId,
      version,
      getPageFromUrl(request.url)
    ),
    seo: (await serverLoader()).seo,
  };
}

clientLoader.hydrate = true;

export default function PackageVersionRequired() {
  const { communityId, dependencies } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  // SSR failed to fetch, retry as authenticated user on client.
  if (dependencies === undefined) {
    return <SkeletonBox className="paginated-dependencies__skeleton" />;
  }

  return (
    <Suspense
      fallback={<SkeletonBox className="paginated-dependencies__skeleton" />}
    >
      <Await
        resolve={dependencies}
        errorElement={
          <TabFetchState
            variant="danger"
            message="Error occurred while loading required dependencies"
          />
        }
      >
        {(resolvedDependencies) => (
          <PaginatedDependencies
            dependencies={resolvedDependencies}
            communityId={communityId}
          />
        )}
      </Await>
    </Suspense>
  );
}
