import { faCog, faList, faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRight } from "@fortawesome/pro-solid-svg-icons";
import { ReviewPackageForm } from "./ReviewPackageForm";
import { type DapperTsInterface } from "@thunderstore/dapper-ts";
import { NewButton, NewIcon, useToast } from "@thunderstore/cyberstorm";
import {
  fetchPackagePermissions,
  type RequestConfig,
} from "@thunderstore/thunderstore-api";
import { type PackageListingStatus } from "@thunderstore/dapper/types";

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

  return (
    <div className="package-listing-management-tools">
      {/* Review Package */}
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

          {/* Package Listing admin link */}
          {perms.can_view_listing_admin_page && (
            <NewButton
              csSize="small"
              csVariant="secondary"
              primitiveType="link"
              href=""
            >
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faList} />
              </NewIcon>
              Listing admin
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faArrowUpRight} />
              </NewIcon>
            </NewButton>
          )}

          {/* Package admin link */}
          {perms.can_view_package_admin_page && (
            <NewButton
              csSize="small"
              csVariant="secondary"
              primitiveType="link"
              href=""
            >
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faBoxOpen} />
              </NewIcon>
              Package admin
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faArrowUpRight} />
              </NewIcon>
            </NewButton>
          )}
        </div>
      )}

      {/* Manage package */}
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
    </div>
  );
}
