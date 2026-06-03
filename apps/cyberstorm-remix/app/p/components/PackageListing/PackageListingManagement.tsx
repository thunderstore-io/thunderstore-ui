import { Suspense } from "react";
import { Await } from "react-router";

import { useToast } from "@thunderstore/cyberstorm";
import { type DapperTsInterface } from "@thunderstore/dapper-ts";
import {
  type RequestConfig,
  fetchPackagePermissions,
} from "@thunderstore/thunderstore-api";

import { type getPrivateListing } from "../../listingUtils";
import { ManagementTools } from "./ManagementTools";
import { InternalNotes, RejectionReason } from "./ReviewInformation";

type Listing = NonNullable<Awaited<ReturnType<typeof getPrivateListing>>>;
type Permissions = Awaited<ReturnType<typeof fetchPackagePermissions>>;
type ListingStatus = Awaited<
  ReturnType<DapperTsInterface["getPackageListingStatus"]>
>;

export interface PackageListingManagementProps {
  listing: Listing;
  listingStatus: Promise<ListingStatus | undefined> | ListingStatus | undefined;
  permissions: Promise<Permissions | undefined> | Permissions | undefined;
  toast: ReturnType<typeof useToast>;
  requestConfig: () => RequestConfig;
}

export function PackageListingManagement({
  listing,
  listingStatus,
  permissions,
  toast,
  requestConfig,
}: PackageListingManagementProps) {
  return (
    <Suspense>
      <Await resolve={listingStatus}>
        {(resolvedListingStatus) => (
          <>
            <RejectionReason status={resolvedListingStatus} />
            <InternalNotes status={resolvedListingStatus} />
          </>
        )}
      </Await>

      <Await resolve={permissions}>
        {(resolvedPermissions) =>
          !resolvedPermissions ? null : (
            <ManagementTools
              listing={listing}
              permissions={resolvedPermissions.permissions}
              listingStatus={listingStatus}
              toast={toast}
              requestConfig={requestConfig}
            />
          )
        }
      </Await>
    </Suspense>
  );
}
