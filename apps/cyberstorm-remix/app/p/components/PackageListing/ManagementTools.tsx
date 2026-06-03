import { faBoxOpen, faListUl } from "@fortawesome/free-solid-svg-icons";
import { faArrowUpRight } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getPublicEnvVariables } from "cyberstorm/security/publicEnvVariables";
import { Suspense } from "react";
import { Await } from "react-router";

import { NewButton, NewIcon, useToast } from "@thunderstore/cyberstorm";
import { type DapperTsInterface } from "@thunderstore/dapper-ts";
import {
  type RequestConfig,
  fetchPackagePermissions,
} from "@thunderstore/thunderstore-api";

import { type getPrivateListing } from "../../listingUtils";
import { ManagePackageForm } from "./ManagePackageForm";
import { ReviewPackageForm } from "./ReviewPackageForm";

type Listing = NonNullable<Awaited<ReturnType<typeof getPrivateListing>>>;
type Permissions = Awaited<
  ReturnType<typeof fetchPackagePermissions>
>["permissions"];
type ListingStatus = Awaited<
  ReturnType<DapperTsInterface["getPackageListingStatus"]>
>;

export interface ManagementToolsProps {
  listing: Listing;
  permissions: Permissions;
  listingStatus: Promise<ListingStatus | undefined> | ListingStatus | undefined;
  toast: ReturnType<typeof useToast>;
  requestConfig: () => RequestConfig;
}

export function ManagementTools({
  listing,
  permissions,
  listingStatus,
  toast,
  requestConfig,
}: ManagementToolsProps) {
  const publicEnvVariables = getPublicEnvVariables(["VITE_SITE_URL"]);

  const showManagePackage = permissions.can_manage || permissions.can_moderate;

  return (
    <div className="package-listing-management-tools">
      {showManagePackage ? (
        <div className="package-listing-management-tools__island">
          <ManagePackageForm
            listing={listing}
            permissions={permissions}
            toast={toast}
            config={requestConfig}
          />
        </div>
      ) : null}

      <Suspense fallback={null}>
        <Await resolve={listingStatus}>
          {(resolvedListingStatus) => (
            <ManagementToolsListingStatus
              listing={listing}
              permissions={permissions}
              listingStatus={resolvedListingStatus}
              publicEnvVariables={publicEnvVariables}
              toast={toast}
              requestConfig={requestConfig}
            />
          )}
        </Await>
      </Suspense>
    </div>
  );
}

function ManagementToolsListingStatus({
  listing,
  permissions,
  listingStatus,
  publicEnvVariables,
  toast,
  requestConfig,
}: {
  listing: Listing;
  permissions: Permissions;
  listingStatus: ListingStatus | undefined;
  publicEnvVariables: ReturnType<typeof getPublicEnvVariables>;
  toast: ReturnType<typeof useToast>;
  requestConfig: () => RequestConfig;
}) {
  const canViewListingAdmin =
    permissions.can_view_listing_admin_page && listingStatus?.listing_admin_url;
  const canViewPackageAdmin =
    permissions.can_view_package_admin_page && listingStatus?.package_admin_url;

  if (
    !permissions.can_moderate &&
    !canViewListingAdmin &&
    !canViewPackageAdmin
  ) {
    return null;
  }

  return (
    <>
      {permissions.can_moderate ? (
        <div className="package-listing-management-tools__island">
          <ReviewPackageForm
            communityId={listing.community_identifier}
            namespaceId={listing.namespace}
            packageId={listing.name}
            packageListingStatus={listingStatus}
            toast={toast}
            config={requestConfig}
          />
        </div>
      ) : null}

      {canViewListingAdmin || canViewPackageAdmin ? (
        <div className="package-listing-management-tools__island">
          {canViewListingAdmin ? (
            <NewButton
              csSize="small"
              csVariant="secondary"
              primitiveType="link"
              href={`${publicEnvVariables.VITE_SITE_URL}${listingStatus.listing_admin_url}`}
            >
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faListUl} />
              </NewIcon>
              Package Listing Admin
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faArrowUpRight} />
              </NewIcon>
            </NewButton>
          ) : null}
          {canViewPackageAdmin ? (
            <NewButton
              csSize="small"
              csVariant="secondary"
              primitiveType="link"
              href={`${publicEnvVariables.VITE_SITE_URL}${listingStatus.package_admin_url}`}
            >
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faBoxOpen} />
              </NewIcon>
              Package Admin
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faArrowUpRight} />
              </NewIcon>
            </NewButton>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
