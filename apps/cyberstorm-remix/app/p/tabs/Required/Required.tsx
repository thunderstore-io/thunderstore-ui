import { PaginatedDependencies } from "app/commonComponents/PaginatedDependencies/PaginatedDependencies";
import { getPrivateListing, getPublicListing } from "app/p/listingUtils";
import { getDapperForRequest } from "cyberstorm/utils/dapperSingleton";
import { getApiHostForSsr } from "cyberstorm/utils/env";
import { Suspense } from "react";
import { Await, type LoaderFunctionArgs, useLoaderData } from "react-router";

import { SkeletonBox } from "@thunderstore/cyberstorm";
import { DapperTs } from "@thunderstore/dapper-ts";

const Dependency404 = new Response("Package dependencies not found", {
  status: 404,
});

const getPageFromUrl = (url: string): number | undefined => {
  const searchParams = new URL(url).searchParams;
  const maybePage = searchParams.get("page");
  return maybePage ? Number(maybePage) : undefined;
};

export async function loader({ params, request }: LoaderFunctionArgs) {
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
      return { dependencies: undefined };
    }

    version = listing.latest_version_number;
  } else {
    throw Dependency404; // Can't happen, satisfies TypeScript
  }

  return {
    dependencies: await dapper.getPackageVersionDependencies(
      namespaceId,
      packageId,
      version,
      getPageFromUrl(request.url)
    ),
  };
}

export async function clientLoader({ params, request }: LoaderFunctionArgs) {
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
    dependencies: dapper.getPackageVersionDependencies(
      namespaceId,
      packageId,
      version,
      getPageFromUrl(request.url)
    ),
  };
}

clientLoader.hydrate = true;

export default function PackageVersionRequired() {
  const { dependencies } = useLoaderData<typeof loader | typeof clientLoader>();

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
