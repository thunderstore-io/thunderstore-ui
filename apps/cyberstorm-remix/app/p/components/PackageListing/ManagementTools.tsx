import { faBoxOpen, faListUl } from "@fortawesome/free-solid-svg-icons";
import { faArrowUpRight } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getPublicEnvVariables } from "cyberstorm/security/publicEnvVariables";

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

export interface ManagementToolsProps {
  listing: Listing;
  permissions: Permissions;
  listingStatus:
    | Awaited<ReturnType<DapperTsInterface["getPackageListingStatus"]>>
    | undefined;
  communityFilters: Awaited<
    ReturnType<DapperTsInterface["getCommunityFilters"]>
  >;
  toast: ReturnType<typeof useToast>;
  requestConfig: () => RequestConfig;
}

export function ManagementTools({
  listing,
  permissions,
  listingStatus,
  communityFilters,
  toast,
  requestConfig,
}: ManagementToolsProps) {
  const publicEnvVariables = getPublicEnvVariables(["VITE_SITE_URL"]);

  const canViewListingAdmin =
    permissions.can_view_listing_admin_page && listingStatus?.listing_admin_url;
  const canViewPackageAdmin =
    permissions.can_view_package_admin_page && listingStatus?.package_admin_url;

  return (
    <div className="package-listing-management-tools">
      {permissions.can_moderate && (
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
      )}

      {permissions.can_manage && (
        <div className="package-listing-management-tools__island">
          <ManagePackageForm
            listing={listing}
            permissions={permissions}
            communityFilters={communityFilters}
            toast={toast}
            config={requestConfig}
          />
        </div>
      )}

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
    </div>
  );
}
