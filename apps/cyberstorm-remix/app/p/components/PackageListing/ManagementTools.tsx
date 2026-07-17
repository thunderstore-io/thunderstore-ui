import { faBoxOpen, faListUl } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getPublicEnvVariables } from "cyberstorm/security/publicEnvVariables";
import { Suspense } from "react";
import { Await } from "react-router";
import { Island } from "~/commonComponents/Island/Island";

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

  // All management actions live in ONE dashed box as icon-only buttons; the box
  // hides itself (:empty in CSS) when the user has no applicable action.
  return (
    <Island variant="special" rootClasses="package-listing-management-tools">
      {showManagePackage ? (
        <ManagePackageForm
          listing={listing}
          permissions={permissions}
          toast={toast}
          config={requestConfig}
        />
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
    </Island>
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

  return (
    <>
      {permissions.can_moderate ? (
        <ReviewPackageForm
          communityId={listing.community_identifier}
          namespaceId={listing.namespace}
          packageId={listing.name}
          packageListingStatus={listingStatus}
          toast={toast}
          config={requestConfig}
        />
      ) : null}

      {canViewListingAdmin ? (
        <NewButton
          csSize="small"
          csVariant="secondary"
          csModifiers={["only-icon"]}
          aria-label="Package Listing Admin"
          tooltipText="Package Listing Admin"
          primitiveType="link"
          href={`${publicEnvVariables.VITE_SITE_URL}${listingStatus.listing_admin_url}`}
        >
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faListUl} />
          </NewIcon>
        </NewButton>
      ) : null}

      {canViewPackageAdmin ? (
        <NewButton
          csSize="small"
          csVariant="secondary"
          csModifiers={["only-icon"]}
          aria-label="Package Admin"
          tooltipText="Package Admin"
          primitiveType="link"
          href={`${publicEnvVariables.VITE_SITE_URL}${listingStatus.package_admin_url}`}
        >
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faBoxOpen} />
          </NewIcon>
        </NewButton>
      ) : null}
    </>
  );
}
