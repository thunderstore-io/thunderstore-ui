import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { hasSessionCookie } from "cyberstorm/utils/gatedSsr";

import { DapperTs } from "@thunderstore/dapper-ts";
import type { PackagePermissions } from "@thunderstore/dapper/types";
import { isApiError } from "@thunderstore/thunderstore-api";

/**
 * Returns true only when the URL's hostname is exactly github.com or
 * www.github.com, preventing both false positives (e.g. github.com.evil.com)
 * and false negatives (http:// or www. variants).
 */
export function isGithubUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return hostname === "github.com" || hostname === "www.github.com";
  } catch {
    return false;
  }
}

export interface ListingIdentifiers {
  communityId: string;
  namespaceId: string;
  packageId: string;
  packageVersion?: string;
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
  const { communityId, namespaceId, packageId, packageVersion } = ids;
  try {
    return await dapper.getPackageListingDetails(
      communityId,
      namespaceId,
      packageId,
      packageVersion
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
 * 2. If 404 and a session cookie is present, retry with the session
 *    attached (e.g. rejected listings are visible to moderators and to
 *    the package's team members)
 * 3. If still missing, throw 404
 */
export async function getPrivateListing(
  dapper: DapperTs,
  ids: ListingIdentifiers
) {
  const { communityId, namespaceId, packageId, packageVersion } = ids;

  try {
    return await dapper.getPackageListingDetails(
      communityId,
      namespaceId,
      packageId,
      packageVersion
    );
  } catch (e) {
    const is404 = isApiError(e) && e.response?.status === 404;
    if (!is404) {
      throw e;
    }
  }

  // An anonymous retry cannot see more than the public request did, so
  // skip the extra API request and settle for the 404.
  if (!hasSessionCookie()) {
    throw new Response("Package not found", { status: 404 });
  }

  try {
    return await dapper.getPackageListingDetails(
      communityId,
      namespaceId,
      packageId,
      packageVersion,
      true
    );
  } catch (e) {
    // A logged-in user who still can't see the listing — a genuine 404, or a
    // 403 when the backend hides its existence — should land on a clean 404
    // page. Without this, the raw ApiError escapes uncaught: it isn't a
    // RouteErrorResponse, so isExpectedRouteError() lets Sentry capture it as a
    // bug and the generic error boundary renders instead of the 404 page.
    const status = isApiError(e) ? e.response?.status : undefined;
    if (status === 404 || status === 403) {
      throw new Response("Package not found", { status: 404 });
    }
    throw e;
  }
}

export function needsPackageListingStatus(
  permissions: PackagePermissions["permissions"] | undefined
): boolean {
  if (!permissions) {
    return false;
  }

  return (
    permissions.can_manage ||
    permissions.can_moderate ||
    permissions.can_view_listing_admin_page ||
    permissions.can_view_package_admin_page
  );
}

/**
 * Resolves listing status only when permissions require it (moderation/manage/admin).
 */
export async function getPackageListingStatusWhenNeeded(
  tools: ReturnType<typeof getSessionTools>,
  dapper: DapperTs,
  ids: ListingIdentifiers,
  permissions: PackagePermissions | undefined
) {
  if (!needsPackageListingStatus(permissions?.permissions)) {
    return undefined;
  }

  return getPackageListingStatus(
    tools,
    dapper,
    ids.communityId,
    ids.namespaceId,
    ids.packageId
  );
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
