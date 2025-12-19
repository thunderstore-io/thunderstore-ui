import { DapperTs } from "@thunderstore/dapper-ts";
import { isApiError } from "@thunderstore/thunderstore-api";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";

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
  } catch (e) {
    const is404 = isApiError(e) && e.response?.status === 404;
    if (!is404) {
      throw e;
    }
  }

  const privateListing = await dapper.getPackageListingDetails(
    communityId,
    namespaceId,
    packageId,
    true
  );

  if (!privateListing) {
    throw new Response("Package not found", { status: 404 });
  }

  return privateListing;
}

/**
 * Fetches the package listing status for the current user.
 * If the user is not logged in or does not have permission, returns undefined.
 */
export async function getPackageListingStatus(
  tools: ReturnType<typeof getSessionTools>,
  dapper: DapperTs,
  communityId: string,
  namespaceId: string,
  packageId: string
) {
  const cu = await tools.getSessionCurrentUser();

  if (!cu.username) {
    return undefined;
  }

  try {
    return await dapper.getPackageListingStatus(
      communityId,
      namespaceId,
      packageId
    );
  } catch (error: unknown) {
    if (isApiError(error) && error.response.status === 403) {
      return undefined;
    }

    throw error;
  }
}

/**
 * Fetches the package permissions for the current user.
 * If the user is not logged in, returns undefined.
 */
export async function getUserPermissions(
  tools: ReturnType<typeof getSessionTools>,
  dapper: DapperTs,
  communityId: string,
  namespaceId: string,
  packageId: string
) {
  const cu = await tools.getSessionCurrentUser();
  if (cu.username) {
    return await dapper.getPackagePermissions(
      communityId,
      namespaceId,
      packageId
    );
  }
  return undefined;
}
