import { Drawer, Heading } from "@thunderstore/cyberstorm";
import { PackageMeta } from "./PackageMeta";
import { PackageBox } from "./PackageBox";
import { Await } from "react-router";
import { Suspense } from "react";

import {
  type PackageListingDetails,
  type Community,
} from "@thunderstore/dapper/types";

type PackageDrawerProps = {
  lastUpdated?: React.ReactElement;
  firstUploaded?: React.ReactElement;
  listing: PackageListingDetails;
  community: Community | Promise<Community>;
  domain: string;
};

export function PackageDrawer({
  lastUpdated,
  firstUploaded,
  listing,
  community,
  domain,
}: PackageDrawerProps) {
  return (
    <Drawer
      popoverId="packageDetailDrawer"
      headerContent={
        <Heading csLevel="3" csSize="3">
          Details
        </Heading>
      }
      rootClasses="package-listing__drawer"
    >
      <PackageMeta
        listing={listing}
        lastUpdated={lastUpdated}
        firstUploaded={firstUploaded}
      />
      <Suspense fallback={<p>Loading...</p>}>
        <Await resolve={community}>
          {(resolvedCommunity) => (
            <PackageBox
              listing={listing}
              community={resolvedCommunity}
              domain={domain}
            />
          )}
        </Await>
      </Suspense>
    </Drawer>
  );
}
