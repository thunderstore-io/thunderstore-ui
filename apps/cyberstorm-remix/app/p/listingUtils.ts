import { DapperTs } from "@thunderstore/dapper-ts";
import { isApiError } from "@thunderstore/thunderstore-api";

export interface ListingIdentifiers {
  communityId: string;
  namespaceId: string;
  packageId: string;
}

/**
 * Server-side listing fetcher:
 * 1. Try public listing
 * 2. If 404, return undefined
 */
export async function getPublicListing(
  dapper: DapperTs,
  ids: ListingIdentifiers
) {
  const { communityId, namespaceId, packageId } = ids;
  try {
    return await dapper.getPackageListingDetails(
      communityId,
      namespaceId,
      packageId
    );
  } catch (e) {
    if (isApiError(e) && e.response.status === 404) {
      return undefined;
    } else {
      throw e;
    }
  }
}

/**
 * Client-side listing fetcher:
 * 1. Try public listing
 * 2. If 404, try private listing
 * 3. If still missing, throw 404
 */
export async function getPrivateListing(
  dapper: DapperTs,
  ids: ListingIdentifiers
) {
  const { communityId, namespaceId, packageId } = ids;

  try {
    return await dapper.getPackageListingDetails(
      communityId,
      namespaceId,
      packageId
    );
  } catch (err: any) {
    const is404 = isApiError(err) && err.response?.status === 404;
    if (!is404) {
      throw err;
    }
  }

  const useSession = true;
  const privateListing = await dapper.getPackageListingDetails(
    communityId,
    namespaceId,
    packageId,
    useSession
  );

  if (!privateListing) {
    throw new Response("Package not found", { status: 404 });
  }

  return privateListing;
}

