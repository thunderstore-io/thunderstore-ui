import { faBoxOpen, faCog, faListUl } from "@fortawesome/free-solid-svg-icons";
import { faArrowUpRight } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getPublicEnvVariables } from "cyberstorm/security/publicEnvVariables";

import { NewButton, NewIcon, useToast } from "@thunderstore/cyberstorm";
import { type DapperTsInterface } from "@thunderstore/dapper-ts";
import { type PackageListingStatus } from "@thunderstore/dapper/types";
import {
  type RequestConfig,
  fetchPackagePermissions,
} from "@thunderstore/thunderstore-api";

import { ReviewPackageForm } from "./ReviewPackageForm";

export interface ManagementToolsProps {
  packagePermissions: Awaited<ReturnType<typeof fetchPackagePermissions>>;
  listing: Awaited<ReturnType<DapperTsInterface["getPackageListingDetails"]>>;
  listingStatus?: PackageListingStatus;
  toast: ReturnType<typeof useToast>;
  requestConfig: () => RequestConfig;
}

export function ManagementTools({
  packagePermissions,
  listing,
  listingStatus,
  toast,
  requestConfig,
}: ManagementToolsProps) {
  const perms = packagePermissions.permissions;
  const pkg = packagePermissions.package;

  const { VITE_SITE_URL: siteUrl } = getPublicEnvVariables(["VITE_SITE_URL"]);

  return (
    <div className="package-listing-management-tools">
      {perms.can_moderate && (
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

      {(perms.can_manage || perms.can_moderate) && (
        <div className="package-listing-management-tools__island">
          <NewButton
            csSize="small"
            primitiveType="cyberstormLink"
            linkId="PackageEdit"
            community={pkg.community_id}
            namespace={pkg.namespace_id}
            package={pkg.package_name}
          >
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faCog} />
            </NewIcon>
            Manage Package
          </NewButton>
        </div>
      )}

      {(perms.can_view_listing_admin_page &&
        listingStatus?.listing_admin_url) ||
      (perms.can_view_package_admin_page &&
        listingStatus?.package_admin_url) ? (
        <div className="package-listing-management-tools__island">
          {perms.can_view_listing_admin_page &&
          listingStatus?.listing_admin_url ? (
            <NewButton
              csSize="small"
              csVariant="secondary"
              primitiveType="link"
              href={`${siteUrl}${listingStatus.listing_admin_url}`}
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
          {perms.can_view_package_admin_page &&
          listingStatus?.package_admin_url ? (
            <NewButton
              csSize="small"
              csVariant="secondary"
              primitiveType="link"
              href={`${siteUrl}${listingStatus.package_admin_url}`}
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
