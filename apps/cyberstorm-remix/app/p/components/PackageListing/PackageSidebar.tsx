import { NewButton, NewIcon, ThunderstoreLogo } from "@thunderstore/cyberstorm";
import { Suspense } from "react";
import { Await } from "react-router";
import { PackageActions } from "./PackageActions";
import { PackageMeta } from "./PackageMeta";
import { PackageBox } from "./PackageBox";

import {
  type PackageListingDetails,
  type Team,
  type CurrentUser,
  type Community,
} from "@thunderstore/dapper/types";

type PackageSidebarProps = {
  listing: PackageListingDetails;
  team: Team | Promise<Team>;
  isLiked: boolean;
  currentUser: CurrentUser | undefined;
  packageLikeAction: (
    isLiked: boolean,
    namespace: string,
    packageName: string,
    isLoggedIn: boolean
  ) => void;
  ReportPackageButton: React.ReactNode;
  lastUpdated: React.ReactElement | undefined;
  firstUploaded: React.ReactElement | undefined;
  community: Community | Promise<Community>;
  domain: string;
};

export function PackageSidebar({
  listing,
  team,
  isLiked,
  currentUser,
  packageLikeAction,
  ReportPackageButton,
  lastUpdated,
  firstUploaded,
  community,
  domain,
}: PackageSidebarProps) {
  return (
    <aside className="package-listing-sidebar">
      <NewButton
        csVariant="accent"
        csSize="big"
        rootClasses="package-listing-sidebar__install"
        primitiveType="link"
        href={listing.install_url}
      >
        <NewIcon csMode="inline">
          <ThunderstoreLogo />
        </NewIcon>
        Install
      </NewButton>

      <div className="package-listing-sidebar__main">
        <div className="package-listing-sidebar__actions">
          <Suspense>
            <Await resolve={team}>
              {(resolvedTeam) => (
                <PackageActions
                  team={resolvedTeam}
                  listing={listing}
                  isLiked={isLiked}
                  currentUser={currentUser}
                  packageLikeAction={packageLikeAction}
                />
              )}
            </Await>
          </Suspense>
          {ReportPackageButton}
        </div>
        <PackageMeta
          listing={listing}
          lastUpdated={lastUpdated}
          firstUploaded={firstUploaded}
        />
      </div>

      <Suspense>
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
    </aside>
  );
}
