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
type CommunityFilters = Awaited<
  ReturnType<DapperTsInterface["getCommunityFilters"]>
>;

export interface PackageListingManagementProps {
  listing: Listing;
  listingStatus: Promise<ListingStatus | undefined> | ListingStatus | undefined;
  permissions: Promise<Permissions | undefined> | Permissions | undefined;
  communityFilters: Promise<CommunityFilters> | CommunityFilters;
  toast: ReturnType<typeof useToast>;
  requestConfig: () => RequestConfig;
}

export function PackageListingManagement({
  listing,
  listingStatus,
  permissions,
  communityFilters,
  toast,
  requestConfig,
}: PackageListingManagementProps) {
  return (
    <Suspense>
      <Await resolve={listingStatus}>
        {(resolvedListingStatus) => (
          <Await resolve={permissions}>
            {(resolvedPermissions) =>
              !resolvedPermissions ? null : (
                <Await resolve={communityFilters}>
                  {(resolvedCommunityFilters) => (
                    <>
                      <ManagementTools
                        listing={listing}
                        permissions={resolvedPermissions.permissions}
                        listingStatus={resolvedListingStatus}
                        communityFilters={resolvedCommunityFilters}
                        toast={toast}
                        requestConfig={requestConfig}
                      />
                      <RejectionReason status={resolvedListingStatus} />
                      <InternalNotes status={resolvedListingStatus} />
                    </>
                  )}
                </Await>
              )
            }
          </Await>
        )}
      </Await>
    </Suspense>
  );
}
