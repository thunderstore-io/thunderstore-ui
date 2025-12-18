import type {
  LoaderFunctionArgs,
  ShouldRevalidateFunctionArgs,
} from "react-router";
import {
  Await,
  Outlet,
  useLoaderData,
  useLocation,
  useOutletContext,
} from "react-router";
import {
  Drawer,
  Heading,
  NewAlert,
  NewButton,
  NewIcon,
  NewLink,
  SkeletonBox,
  Tabs,
} from "@thunderstore/cyberstorm";
import "./packageListing.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThunderstoreLogo } from "@thunderstore/cyberstorm/src/svg/svg";
import {
  faUsers,
  faHandHoldingHeart,
  faDownload,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { memo, Suspense } from "react";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";
import { faArrowUpRight } from "@fortawesome/pro-solid-svg-icons";
import { RelativeTime } from "@thunderstore/cyberstorm/src/components/RelativeTime/RelativeTime";
import {
  formatFileSize,
  formatInteger,
  formatToDisplayName,
} from "@thunderstore/cyberstorm/src/utils/utils";
import { DapperTs } from "@thunderstore/dapper-ts";
import { type OutletContextShape } from "~/root";
import { CopyButton } from "~/commonComponents/CopyButton/CopyButton";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { getPrivateListing, getPublicListing } from "./listingUtils";
import {
  type PackageListingDetails,
  type TeamDetails,
} from "@thunderstore/dapper/types";

export async function loader({ params }: LoaderFunctionArgs) {
  const { communityId, namespaceId, packageId, packageVersion } = params;

  if (!communityId || !namespaceId || !packageId || !packageVersion) {
    throw new Response("Package not found", { status: 404 });
  }

  const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
  const dapper = new DapperTs(() => ({
    apiHost: publicEnvVariables.VITE_API_URL,
    sessionId: undefined,
  }));

  const listing = await getPublicListing(dapper, {
    communityId,
    namespaceId,
    packageId,
    packageVersion,
  });

  return {
    listing,
    packageVersion,
    team: await dapper.getTeamDetails(namespaceId),
  };
}

export async function clientLoader({ params }: LoaderFunctionArgs) {
  const { communityId, namespaceId, packageId, packageVersion } = params;

  if (!communityId || !namespaceId || !packageId || !packageVersion) {
    throw new Response("Package not found", { status: 404 });
  }

  const tools = getSessionTools();
  const config = tools.getConfig();
  const dapper = new DapperTs(() => ({
    apiHost: config.apiHost,
    sessionId: config.sessionId,
  }));

  const listing = await getPrivateListing(dapper, {
    communityId,
    namespaceId,
    packageId,
    packageVersion,
  });

  return {
    listing,
    packageVersion,
    team: dapper.getTeamDetails(namespaceId),
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
      <meta
        title={`${formatToDisplayName(
          listing.full_version_name
        )} | Thunderstore - The ${listing.community_name} Mod Database`}
      />
      <meta name="description" content={listing.description} />
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content={`${
          getPublicEnvVariables(["VITE_BETA_SITE_URL"]).VITE_BETA_SITE_URL
        }${location.pathname}`}
      />
      <meta
        property="og:title"
        content={`${formatToDisplayName(listing.full_version_name)} by ${
          listing.namespace
        }`}
      />
      <meta property="og:description" content={listing.description} />
      <meta property="og:image:width" content="256" />
      <meta property="og:image:height" content="256" />
      <meta property="og:image" content={listing.icon_url ?? undefined} />
      <meta property="og:site_name" content="Thunderstore" />

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
                <Suspense fallback={<p>Loading...</p>}>
                  <Await resolve={team}>
                    {(resolvedTeam) => (
                      <Actions team={resolvedTeam} listing={listing} />
                    )}
                  </Await>
                </Suspense>
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
              <NewButton
                csVariant="accent"
                csSize="big"
                rootClasses="package-listing-sidebar__install"
                primitiveType="link"
                href={listing.install_url || ""}
                disabled={!listing.install_url}
              >
                <NewIcon csMode="inline">
                  <ThunderstoreLogo />
                </NewIcon>
                Install
              </NewButton>
              <div className="package-listing-sidebar__main">
                <Suspense
                  fallback={
                    <SkeletonBox className="package-listing-sidebar__actions-skeleton" />
                  }
                >
                  <Await resolve={team}>
                    {(resolvedTeam) => (
                      <Actions team={resolvedTeam} listing={listing} />
                    )}
                  </Await>
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

const Actions = memo(function Actions(props: {
  listing: PackageListingDetails;
  team: TeamDetails;
}) {
  const { listing, team } = props;
  return (
    <div className="package-listing-sidebar__actions">
      <NewButton
        primitiveType="link"
        href={listing.download_url}
        csVariant="secondary"
        rootClasses="package-listing-sidebar__download"
      >
        <NewIcon csMode="inline" noWrapper>
          <FontAwesomeIcon icon={faDownload} />
        </NewIcon>
        Download
      </NewButton>
      {team.donation_link ? (
        <NewButton
          primitiveType="link"
          href={team.donation_link}
          csVariant="secondary"
          csSize="big"
          csModifiers={["only-icon"]}
        >
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faHandHoldingHeart} />
          </NewIcon>
        </NewButton>
      ) : null}
    </div>
  );
});

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
