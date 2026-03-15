import { faCaretRight, faUsers } from "@fortawesome/free-solid-svg-icons";
import { faArrowUpRight } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getDapperForRequest } from "cyberstorm/utils/dapperSingleton";
import { getApiHostForSsr } from "cyberstorm/utils/env";
import { createSeo } from "cyberstorm/utils/meta";
import { ssrLoader } from "cyberstorm/utils/ssrLoader";
import { Suspense } from "react";
import type { ShouldRevalidateFunctionArgs } from "react-router";
import {
  Outlet,
  useLoaderData,
  useLocation,
  useOutletContext,
} from "react-router";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";
import { type OutletContextShape } from "~/root";

import {
  CopyButton,
  Drawer,
  Heading,
  NewAlert,
  NewIcon,
  NewLink,
  RelativeTime,
  SkeletonBox,
  Tabs,
  formatFileSize,
  formatInteger,
  formatToDisplayName,
} from "@thunderstore/cyberstorm";
import { DapperTs } from "@thunderstore/dapper-ts";
import type { PackageListingDetails } from "@thunderstore/dapper/types";

import type { Route } from "./+types/packageListingVersion";
import { PackageActions } from "./components/PackageListing/PackageActions";
import { getPrivateListing, getPublicListing } from "./listingUtils";
import "./packageListing.css";

export const loader = ssrLoader(
  async ({ params, request }: Route.LoaderArgs) => {
    const { communityId, namespaceId, packageId, packageVersion } = params;

    if (!communityId || !namespaceId || !packageId || !packageVersion) {
      throw new Response("Package not found", { status: 404 });
    }

    const dapper = new DapperTs(() => ({
      apiHost: getApiHostForSsr(),
      sessionId: undefined,
    }));

    const listing = await getPublicListing(dapper, {
      communityId,
      namespaceId,
      packageId,
      packageVersion,
    });

    if (!listing) {
      throw new Response("Package not found", { status: 404 });
    }

    const community = await dapper.getCommunity(communityId);
    const url = new URL(request.url);

    return {
      community,
      listing,
      packageVersion,
      team: await dapper.getTeamDetails(namespaceId),
      seo: createSeo({
        descriptors: [
          {
            title: `${formatToDisplayName(listing.name)} v${packageVersion} | ${
              community.name
            } Mod Database`,
          },
          { name: "description", content: listing.description },
          { property: "og:type", content: "website" },
          { property: "og:url", content: url.href },
          {
            property: "og:title",
            content: `${formatToDisplayName(
              listing.name
            )} v${packageVersion} by ${listing.namespace}`,
          },
          { property: "og:description", content: listing.description },
          ...(listing.icon_url
            ? [
                { property: "og:image", content: listing.icon_url },
                { property: "og:image:width", content: "256" },
                { property: "og:image:height", content: "256" },
              ]
            : []),
          { property: "og:site_name", content: "Thunderstore" },
        ],
      }),
    };
  }
);

export async function clientLoader({
  params,
  request,
  serverLoader,
}: Route.ClientLoaderArgs) {
  const { communityId, namespaceId, packageId, packageVersion } = params;

  if (!communityId || !namespaceId || !packageId || !packageVersion) {
    throw new Response("Package not found", { status: 404 });
  }

  const dapper = getDapperForRequest(request);

  const listing = await getPrivateListing(dapper, {
    communityId,
    namespaceId,
    packageId,
    packageVersion,
  });

  return {
    community: dapper.getCommunity(communityId),
    listing,
    packageVersion,
    team: dapper.getTeamDetails(namespaceId),
    seo: (await serverLoader()).seo,
  };
}

clientLoader.hydrate = true;

export function shouldRevalidate(arg: ShouldRevalidateFunctionArgs) {
  const oldPath = arg.currentUrl.pathname.split("/");
  const newPath = arg.nextUrl.pathname.split("/");
  // If we're staying on the same package page, don't revalidate
  if (
    oldPath[2] === newPath[2] &&
    oldPath[4] === newPath[4] &&
    oldPath[5] === newPath[5] &&
    oldPath[7] === newPath[7]
  ) {
    return false;
  }
  return arg.defaultShouldRevalidate;
}

export default function PackageListingVersion() {
  const { listing, packageVersion, team } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  const location = useLocation();
  const outletContext = useOutletContext() as OutletContextShape;
  const currentTab = location.pathname.split("/")[8] || "details";

  if (!listing) {
    return <div>Loading listing...</div>;
  }

  return (
    <>
      <div className="container container--y container--full">
        <section className="package-listing__package-section">
          <div className="package-listing__main">
            <section className="package-listing__package-content-section">
              <NewAlert csVariant="warning">
                You are viewing a potentially older version of this package.{" "}
                <NewLink
                  primitiveType="cyberstormLink"
                  linkId="Package"
                  community={listing.community_identifier}
                  namespace={listing.namespace}
                  package={listing.name}
                  csVariant="cyber"
                >
                  View Latest Version
                </NewLink>
              </NewAlert>

              <PageHeader
                headingLevel="1"
                headingSize="3"
                image={listing.icon_url}
                description={listing.description}
                variant="detailed"
                meta={
                  <>
                    <NewLink
                      primitiveType="cyberstormLink"
                      linkId="Team"
                      community={listing.community_identifier}
                      team={listing.namespace}
                      csVariant="cyber"
                      rootClasses="page-header__meta-item"
                    >
                      <NewIcon csMode="inline" noWrapper>
                        <FontAwesomeIcon icon={faUsers} />
                      </NewIcon>
                      {listing.namespace}
                    </NewLink>
                    {listing.website_url ? (
                      <NewLink
                        primitiveType="link"
                        href={listing.website_url}
                        csVariant="cyber"
                        rootClasses="page-header__meta-item"
                      >
                        {listing.website_url}
                        <NewIcon csMode="inline" noWrapper>
                          <FontAwesomeIcon icon={faArrowUpRight} />
                        </NewIcon>
                      </NewLink>
                    ) : null}
                  </>
                }
              >
                {formatToDisplayName(listing.name)}
              </PageHeader>

              <div className="package-listing__narrow-actions">
                <PackageActions
                  downloadUrl={listing.download_url}
                  team={team}
                  installUrl={listing.install_url ?? ""}
                  installDisabled={!listing.install_url}
                  packageDetailsNarrow={
                    <>
                      <button
                        popoverTarget="packageDetailDrawer"
                        popoverTargetAction="show"
                        className="button button--variant--secondary button--size--medium package-listing__drawer-button"
                      >
                        Details
                        <NewIcon csMode="inline" noWrapper>
                          <FontAwesomeIcon icon={faCaretRight} />
                        </NewIcon>
                      </button>
                      <Drawer
                        popoverId="packageDetailDrawer"
                        headerContent={
                          <Heading csLevel="3" csSize="3">
                            Details
                          </Heading>
                        }
                        rootClasses="package-listing__drawer"
                      >
                        {packageMeta(listing)}
                      </Drawer>
                    </>
                  }
                />
              </div>

              <Tabs>
                <NewLink
                  key="description"
                  primitiveType="cyberstormLink"
                  linkId="PackageVersion"
                  community={listing.community_identifier}
                  namespace={listing.namespace}
                  package={listing.name}
                  version={packageVersion}
                  aria-current={currentTab === "details"}
                  rootClasses={`tabs-item${
                    currentTab === "details" ? " tabs-item--current" : ""
                  }`}
                >
                  Details
                </NewLink>
                <NewLink
                  key="required"
                  primitiveType="cyberstormLink"
                  linkId="PackageVersionRequired"
                  community={listing.community_identifier}
                  namespace={listing.namespace}
                  package={listing.name}
                  version={packageVersion}
                  aria-current={currentTab === "required"}
                  rootClasses={`tabs-item${
                    currentTab === "required" ? " tabs-item--current" : ""
                  }`}
                >
                  Required ({listing.dependency_count})
                </NewLink>
                <NewLink
                  key="versions"
                  primitiveType="cyberstormLink"
                  linkId="PackageVersionVersions"
                  community={listing.community_identifier}
                  namespace={listing.namespace}
                  package={listing.name}
                  version={packageVersion}
                  aria-current={currentTab === "versions"}
                  rootClasses={`tabs-item${
                    currentTab === "versions" ? " tabs-item--current" : ""
                  }`}
                >
                  Versions
                </NewLink>
              </Tabs>

              <div className="package-listing__content">
                <Outlet context={outletContext} />
              </div>
            </section>
            <aside className="package-listing-sidebar">
              <div className="package-listing-sidebar__main">
                <Suspense
                  fallback={
                    <SkeletonBox className="package-listing-sidebar__actions-skeleton" />
                  }
                >
                  <PackageActions
                    downloadUrl={listing.download_url}
                    team={team}
                    installUrl={listing.install_url ?? ""}
                    installDisabled={!listing.install_url}
                  />
                </Suspense>

                {packageMeta(listing)}
              </div>
            </aside>
          </div>
        </section>
      </div>
    </>
  );
}

function packageMeta(listing: PackageListingDetails) {
  return (
    <div className="package-listing-sidebar__meta">
      <div className="package-listing-sidebar__item">
        <div className="package-listing-sidebar__label">Date Uploaded</div>
        <div className="package-listing-sidebar__content">
          <RelativeTime
            time={listing.datetime_created}
            suppressHydrationWarning
          />
        </div>
      </div>
      <div className="package-listing-sidebar__item">
        <div className="package-listing-sidebar__label">Downloads</div>
        <div className="package-listing-sidebar__content">
          {formatInteger(listing.download_count)}
        </div>
      </div>
      <div className="package-listing-sidebar__item">
        <div className="package-listing-sidebar__label">Size</div>
        <div className="package-listing-sidebar__content">
          {formatFileSize(listing.size)}
        </div>
      </div>
      <div className="package-listing-sidebar__item">
        <div className="package-listing-sidebar__label">Dependency string</div>
        <div className="package-listing-sidebar__content">
          <div className="package-listing-sidebar__dependency-string-wrapper">
            <span
              title={listing.full_version_name}
              className="package-listing-sidebar__dependency-string"
            >
              {listing.full_version_name}
            </span>
            <CopyButton text={listing.full_version_name} />
          </div>
        </div>
      </div>
    </div>
  );
}
