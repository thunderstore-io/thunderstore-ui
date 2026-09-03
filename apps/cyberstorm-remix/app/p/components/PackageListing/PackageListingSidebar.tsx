import { SidebarAd } from "app/commonComponents/Ads/SidebarAd";
import { PACKAGE_SIDEBAR_AD } from "app/commonComponents/Ads/nitroAds";
import { CommunityPromo } from "app/commonComponents/CommunityPromo/CommunityPromo";
import { type ReactElement, type ReactNode, Suspense } from "react";
import { Await } from "react-router";

import {
  NewLink,
  formatFileSize,
  formatInteger,
} from "@thunderstore/cyberstorm";
import { type DapperTsInterface } from "@thunderstore/dapper-ts";
import type { CurrentUser } from "@thunderstore/dapper/types";

import { PackageActions, type PackageActionsProps } from "./PackageActions";
import { PackageCategoriesAndTags } from "./PackageCategoriesAndTags";
import { PackageDependencyString } from "./PackageDependencyString";
import "./PackageListingSidebar.css";

type PackageDetailListing = Awaited<
  ReturnType<DapperTsInterface["getPackageListingDetails"]>
>;
type PackageDetailCommunity = Awaited<
  ReturnType<DapperTsInterface["getCommunity"]>
>;

export function PackageListingSidebar(props: {
  listing: PackageDetailListing;
  team: PackageActionsProps["team"];
  community: Promise<PackageDetailCommunity> | PackageDetailCommunity;
  reportPackageButton: ReactNode;
  isLiked: boolean;
  currentUser?: CurrentUser;
  packageLikeAction: PackageActionsProps["packageLikeAction"];
  lastUpdated: ReactElement | undefined;
  firstUploaded: ReactElement | undefined;
  adsDisabled: boolean;
}) {
  const {
    listing,
    team,
    community,
    reportPackageButton,
    isLiked,
    currentUser,
    packageLikeAction,
    lastUpdated,
    firstUploaded,
    adsDisabled,
  } = props;

  return (
    <aside className="package-listing-sidebar">
      <PackageActions
        downloadUrl={listing.download_url}
        team={team}
        installUrl={listing.install_url}
        reportPackageButton={reportPackageButton}
        isLiked={isLiked}
        currentUser={currentUser}
        packageLikeAction={packageLikeAction}
        namespace={listing.namespace}
        packageName={listing.name}
      />

      <CommunityPromo
        variant="pill"
        communityId={listing.community_identifier}
      />

      <PackageDependencyString dependency={listing.full_version_name} />

      <PackageMeta
        items={getPackageListingMetaItems(listing, lastUpdated, firstUploaded)}
      />

      <Suspense>
        <Await resolve={community}>
          {(resolvedCommunity) => (
            <PackageCategoriesAndTags
              listing={listing}
              community={resolvedCommunity}
            />
          )}
        </Await>
      </Suspense>

      {adsDisabled ? null : <SidebarAd slot={PACKAGE_SIDEBAR_AD} />}
    </aside>
  );
}

PackageListingSidebar.displayName = "PackageListingSidebar";

export type PackageMetaItem = {
  label: string;
  content: ReactNode;
};

/**
 * The sidebar meta box: a list of label/value rows. Callers own the row
 * definitions (they differ per page), so this stays the single source of truth
 * for the row markup and styling.
 */
export function PackageMeta(props: { items: PackageMetaItem[] }) {
  return (
    <div className="package-listing-sidebar__meta">
      {props.items.map((item) => (
        <div key={item.label} className="package-listing-sidebar__item">
          <div className="package-listing-sidebar__label">{item.label}</div>
          <div className="package-listing-sidebar__content">{item.content}</div>
        </div>
      ))}
    </div>
  );
}

PackageMeta.displayName = "PackageMeta";

/** Meta rows for a package listing (shared by the sidebar and the mobile drawer). */
export function getPackageListingMetaItems(
  listing: PackageDetailListing,
  lastUpdated: ReactElement | undefined,
  firstUploaded: ReactElement | undefined
): PackageMetaItem[] {
  return [
    { label: "Latest version", content: listing.latest_version_number },
    { label: "Last Updated", content: lastUpdated },
    { label: "First Uploaded", content: firstUploaded },
    { label: "Downloads", content: formatInteger(listing.download_count) },
    { label: "Likes", content: formatInteger(listing.rating_count) },
    { label: "Size", content: formatFileSize(listing.size) },
    {
      label: "Dependants",
      content: (
        <NewLink
          primitiveType="cyberstormLink"
          linkId="PackageDependants"
          community={listing.community_identifier}
          namespace={listing.namespace}
          package={listing.name}
          csVariant="cyber"
        >
          {listing.dependant_count} other mods
        </NewLink>
      ),
    },
  ];
}
