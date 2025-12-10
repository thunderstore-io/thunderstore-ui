import {
  memo,
  type ReactElement,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Await,
  Outlet,
  useLoaderData,
  useLocation,
  useOutletContext,
  type LoaderFunctionArgs,
} from "react-router";
import { useHydrated } from "remix-utils/use-hydrated";
import {
  faUsers,
  faHandHoldingHeart,
  faDownload,
  faThumbsUp,
  faWarning,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRight, faLips } from "@fortawesome/pro-solid-svg-icons";

import { CopyButton } from "app/commonComponents/CopyButton/CopyButton";
import { PageHeader } from "app/commonComponents/PageHeader/PageHeader";
import TeamMembers from "app/p/components/TeamMembers/TeamMembers";
import { useReportPackage } from "app/p/components/ReportPackage/useReportPackage";
import { type OutletContextShape } from "app/root";
import { isPromise } from "cyberstorm/utils/typeChecks";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";

import {
  Drawer,
  Heading,
  NewButton,
  NewIcon,
  NewLink,
  NewTag,
  RelativeTime,
  Tabs,
  ThunderstoreLogo,
  formatFileSize,
  formatInteger,
  formatToDisplayName,
  useToast,
} from "@thunderstore/cyberstorm";
import { PackageLikeAction } from "@thunderstore/cyberstorm-forms";
import type { CurrentUser } from "@thunderstore/dapper/types";
import { DapperTs, type DapperTsInterface } from "@thunderstore/dapper-ts";
import { getPublicListing, getPrivateListing } from "./listingUtils";
import { ManagementTools } from "./components/PackageListing/ManagementTools";

import "./packageListing.css";

type PackageListingOutletContext = OutletContextShape & {
  packageDownloadUrl?: string;
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { communityId, namespaceId, packageId } = params;

  if (!communityId || !namespaceId || !packageId) {
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
  });

  return {
    community: await dapper.getCommunity(communityId),
    communityFilters: await dapper.getCommunityFilters(communityId),
    listing: listing,
    listingStatus: undefined,
    team: await dapper.getTeamDetails(namespaceId),
    permissions: undefined,
    community_identifier: communityId,
    namespace_id: namespaceId,
    package_id: packageId,
  };
}

async function getUserPermissions(
  tools: ReturnType<typeof getSessionTools>,
  dapper: DapperTs,
  communityId: string,
  namespaceId: string,
  packageId: string
) {
  const cu = await tools.getSessionCurrentUser();
  if (cu.username) {
    return await dapper.getPackagePermissions(communityId, namespaceId, packageId);
  }
  return undefined;
}

async function getPackageListingStatus(
  tools: ReturnType<typeof getSessionTools>,
  dapper: DapperTs,
  communityId: string,
  namespaceId: string,
  packageId: string
) {
  const cu = await tools.getSessionCurrentUser();
  if (cu.username) {
    return await dapper.getPackageListingStatus(communityId, namespaceId, packageId);
  }
  return undefined;
}

export async function clientLoader({ params }: LoaderFunctionArgs) {
  const { communityId, namespaceId, packageId } = params;

  if (!communityId || !namespaceId || !packageId) {
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
  });

  return {
    community: dapper.getCommunity(communityId),
    communityFilters: dapper.getCommunityFilters(communityId),
    listing: listing,
    listingStatus: getPackageListingStatus(
      tools,
      dapper,
      communityId,
      namespaceId,
      packageId
    ),
    team: dapper.getTeamDetails(namespaceId),
    permissions: getUserPermissions(
      tools,
      dapper,
      communityId,
      namespaceId,
      packageId
    ),
    community_identifier: communityId,
    namespace_id: namespaceId,
    package_id: packageId,
  };
}

clientLoader.hydrate = true;

export default function PackageListing() {
  const {
    community,
    listing,
    listingStatus,
    team,
    permissions,
    community_identifier,
    namespace_id,
    package_id
  } = useLoaderData<typeof loader | typeof clientLoader>();


  const location = useLocation();

  const outletContext = useOutletContext() as OutletContextShape;
  const currentUser = outletContext.currentUser;
  const config = outletContext.requestConfig;
  const domain = outletContext.domain;
  const dapper = outletContext.dapper;

  const [isLiked, setIsLiked] = useState(false);
  const toast = useToast();

  const { ReportPackageButton, ReportPackageModal } = useReportPackage({
    formPropsPromise: new Promise(() => ({
      community: community_identifier,
      namespace: namespace_id,
      package: package_id,
    })),
    config: config,
  });

  // TODO: This needs to be fixes - listing is not a promise here
  // TODO: no need to get namespace and name from listing if we have them in params
  const fetchAndSetRatedPackages = async () => {
    const rp = await dapper.getRatedPackages();
    if (isPromise(listing)) {
      listing.then((listingData) => {
        setIsLiked(
          rp.rated_packages.includes(
            `${listingData.namespace}-${listingData.name}`
          )
        );
      });
    } else {
      setIsLiked(
        rp.rated_packages.includes(`${listing.namespace}-${listing.name}`)
      );
    }
  };

  useEffect(() => {
    if (currentUser?.username) {
      fetchAndSetRatedPackages();
    }
  }, [currentUser]);

  const isHydrated = useHydrated();
  const startsHydrated = useRef(isHydrated);

  // START: For sidebar meta dates
  const [lastUpdated, setLastUpdated] = useState<ReactElement | undefined>();
  const [firstUploaded, setFirstUploaded] = useState<
    ReactElement | undefined
  >();

  // This will be loaded 2 times in development because of:
  // https://react.dev/reference/react/StrictMode
  // If strict mode is removed from the entry.client.tsx, this should only run once
  useEffect(() => {
    if (!startsHydrated.current && isHydrated) {
      return;
    }

    if (!listing) {
      return;
    }

    if (isPromise(listing)) {
      listing.then((listingData) => {
        setLastUpdated(
          <RelativeTime
            time={listingData.last_updated}
            suppressHydrationWarning
          />
        );
        setFirstUploaded(
          <RelativeTime
            time={listingData.datetime_created}
            suppressHydrationWarning
          />
        );
      });
    } else {
      setLastUpdated(
        <RelativeTime time={listing.last_updated} suppressHydrationWarning />
      );
      setFirstUploaded(
        <RelativeTime
          time={listing.datetime_created}
          suppressHydrationWarning
        />
      );
    }
  }, []);
  // END: For sidebar meta dates

  const currentTab = location.pathname.split("/")[6] || "details";

  const packageLikeAction = PackageLikeAction({
    isLoggedIn: Boolean(currentUser?.username),
    dataUpdateTrigger: fetchAndSetRatedPackages,
    config: config,
  });

  if (!listing) {
    return <div>Loading package...</div>;
  }

  // TODO: some variables are available in props (communityId, namespaceId, packageId)
  return (
    <>
      <Suspense>
        <Await resolve={community}>
          {(resolvedCommunity) => (
            <>
              <meta
                title={`${formatToDisplayName(
                  listing.name
                )} | Thunderstore - The ${resolvedCommunity.name} Mod Database`}
              />
              <meta name="description" content={listing.description} />
              <meta property="og:type" content="website" />
              <meta
                property="og:url"
                content={`${getPublicEnvVariables(["VITE_BETA_SITE_URL"])}${
                  location.pathname
                }`}
              />
              <meta
                property="og:title"
                content={`${formatToDisplayName(listing.name)} by ${
                  listing.namespace
                }`}
              />
              <meta property="og:description" content={listing.description} />
              <meta property="og:image:width" content="256" />
              <meta property="og:image:height" content="256" />
              <meta property="og:image" content={listing.icon_url ?? undefined} />
              <meta property="og:site_name" content="Thunderstore" />
            </>
          )}
        </Await>
      </Suspense>

      <div className="container container--y container--full">
        <section className="package-listing__package-section">
          <Suspense>
            <Await resolve={Promise.all([listingStatus, permissions])}>
              {([resolvedStatus, resolvedPermissions]) =>
                resolvedPermissions ? (
                  <div className="package-listing__actions">
                    <ManagementTools
                      packagePermissions={resolvedPermissions}
                      listing={listing}
                      listingStatus={resolvedStatus}
                      toast={toast}
                      requestConfig={config}
                    />
                  </div>
                ) : null
              }
            </Await>
          </Suspense>

          <div className="package-listing__main">
            <section className="package-listing__package-content-section">
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
                  headerContent={<Heading csLevel="3" csSize="3">Details</Heading>}
                  rootClasses="package-listing__drawer"
                >
                  {packageMeta(lastUpdated, firstUploaded, listing)}

                  <Suspense fallback={<p>Loading...</p>}>
                    <Await resolve={community}>
                      {(resolvedCommunity) =>
                        packageBoxes(listing, resolvedCommunity, domain)
                      }
                    </Await>
                  </Suspense>
                </Drawer>

                <Suspense fallback={<p>Loading...</p>}>
                  <Await resolve={team}>
                    {(resolvedTeam) => (
                      <Actions
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

              <>
                <Tabs>
                  <NewLink
                    key="description"
                    primitiveType="cyberstormLink"
                    linkId="Package"
                    community={listing.community_identifier}
                    namespace={listing.namespace}
                    package={listing.name}
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
                    linkId="PackageRequired"
                    community={listing.community_identifier}
                    namespace={listing.namespace}
                    package={listing.name}
                    aria-current={currentTab === "required"}
                    rootClasses={`tabs-item${
                      currentTab === "required" ? " tabs-item--current" : ""
                    }`}
                  >
                    Required ({listing.dependency_count})
                  </NewLink>

                  <NewLink
                    key="wiki"
                    primitiveType="cyberstormLink"
                    linkId="PackageWiki"
                    community={listing.community_identifier}
                    namespace={listing.namespace}
                    package={listing.name}
                    aria-current={currentTab === "wiki"}
                    rootClasses={`tabs-item${
                      currentTab === "wiki" ? " tabs-item--current" : ""
                    }`}
                  >
                    Wiki
                  </NewLink>

                  <NewLink
                    key="changelog"
                    primitiveType="cyberstormLink"
                    linkId="PackageChangelog"
                    community={listing.community_identifier}
                    namespace={listing.namespace}
                    package={listing.name}
                    aria-current={currentTab === "changelog"}
                    disabled={!listing.has_changelog}
                    rootClasses={`tabs-item${
                      currentTab === "changelog" ? " tabs-item--current" : ""
                    }`}
                  >
                    Changelog
                  </NewLink>

                  <NewLink
                    key="versions"
                    primitiveType="cyberstormLink"
                    linkId="PackageVersions"
                    community={listing.community_identifier}
                    namespace={listing.namespace}
                    package={listing.name}
                    aria-current={currentTab === "versions"}
                    rootClasses={`tabs-item${
                      currentTab === "versions" ? " tabs-item--current" : ""
                    }`}
                  >
                    Versions
                  </NewLink>

                  <NewLink
                    key="source"
                    primitiveType="cyberstormLink"
                    linkId="PackageSource"
                    community={listing.community_identifier}
                    namespace={listing.namespace}
                    package={listing.name}
                    aria-current={currentTab === "source"}
                    rootClasses={`tabs-item${
                      currentTab === "source" ? " tabs-item--current" : ""
                    }`}
                  >
                    Analysis
                  </NewLink>
                </Tabs>

                <div className="package-listing__content">
                  <Outlet
                    context={
                      {
                        ...outletContext,
                        packageDownloadUrl: listing.download_url,
                      } as PackageListingOutletContext
                    }
                  />
                </div>
              </>
            </section>

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
                        <Actions
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

                {packageMeta(lastUpdated, firstUploaded, listing)}
              </div>

              <Suspense>
                <Await resolve={community}>
                  {(resolvedCommunity) =>
                    packageBoxes(listing, resolvedCommunity, domain)
                  }
                </Await>
              </Suspense>
            </aside>
          </div>
        </section>
      </div>

      {ReportPackageModal}
    </>
  );
}

function packageTags(
  listing: Awaited<ReturnType<DapperTsInterface["getPackageListingDetails"]>>,
  community: Awaited<ReturnType<DapperTsInterface["getCommunity"]>>
) {
  return listing.categories.map((category) => {
    return (
      <NewTag
        key={category.name}
        csMode="cyberstormLink"
        linkId="Community"
        community={community.identifier}
        queryParams={`includedCategories=${category.id}`}
        csSize="small"
        csVariant="primary"
      >
        {category.name}
      </NewTag>
    );
  });
}

function packageBoxes(
  listing: Awaited<ReturnType<DapperTsInterface["getPackageListingDetails"]>>,
  community: Awaited<ReturnType<DapperTsInterface["getCommunity"]>>,
  domain: string
) {
  const pt = packageTags(listing, community);

  return (
    <>
      {pt.length > 0 || listing.is_deprecated || listing.is_nsfw ? (
        <div className="package-listing-sidebar__categories">
          <div className="package-listing-sidebar__header">
            <Heading csLevel="4" csSize="4">
              Categories
            </Heading>
          </div>
          {pt.length > 0 ? (
            <div className="package-listing-sidebar__body">{pt}</div>
          ) : null}
          {listing.is_deprecated || listing.is_nsfw ? (
            <div className="package-listing-sidebar__body">
              {listing.is_deprecated ? (
                <NewTag
                  csSize="small"
                  csModifiers={["dark"]}
                  csVariant="yellow"
                >
                  <NewIcon noWrapper csMode="inline">
                    <FontAwesomeIcon icon={faWarning} />
                  </NewIcon>
                  Deprecated
                </NewTag>
              ) : null}
              {listing.is_nsfw ? (
                <NewTag csSize="small" csModifiers={["dark"]} csVariant="pink">
                  <NewIcon noWrapper csMode="inline">
                    <FontAwesomeIcon icon={faLips} />
                  </NewIcon>
                  NSFW
                </NewTag>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
      {listing.team.members.length > 0 ? (
        <TeamMembers listing={listing} domain={domain} />
      ) : null}
    </>
  );
}

const Actions = memo(function Actions(props: {
  team: Awaited<ReturnType<DapperTsInterface["getTeamDetails"]>>;
  listing: Awaited<ReturnType<DapperTsInterface["getPackageListingDetails"]>>;
  isLiked: boolean;
  currentUser: CurrentUser | undefined;
  packageLikeAction: (
    isLiked: boolean,
    namespace: string,
    packageName: string,
    isLoggedIn: boolean
  ) => void;
}) {
  const { team, listing, isLiked, currentUser, packageLikeAction } = props;
  return (
    <>
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
      <NewButton
        primitiveType="button"
        onClick={() =>
          packageLikeAction(
            isLiked,
            listing.namespace,
            listing.name,
            Boolean(currentUser?.username)
          )
        }
        tooltipText="Like"
        csVariant={isLiked ? "primary" : "secondary"}
        csSize="big"
        csModifiers={["only-icon"]}
      >
        <NewIcon csMode="inline" noWrapper>
          <FontAwesomeIcon icon={faThumbsUp} />
        </NewIcon>
      </NewButton>
    </>
  );
});

function packageMeta(
  lastUpdated: ReactElement | undefined,
  firstUploaded: ReactElement | undefined,
  listing: Awaited<ReturnType<DapperTsInterface["getPackageListingDetails"]>>
) {
  return (
    <div className="package-listing-sidebar__meta">
      <div className="package-listing-sidebar__item">
        <div className="package-listing-sidebar__label">Last Updated</div>
        <div className="package-listing-sidebar__content">{lastUpdated}</div>
      </div>
      <div className="package-listing-sidebar__item">
        <div className="package-listing-sidebar__label">First Uploaded</div>
        <div className="package-listing-sidebar__content">{firstUploaded}</div>
      </div>
      <div className="package-listing-sidebar__item">
        <div className="package-listing-sidebar__label">Downloads</div>
        <div className="package-listing-sidebar__content">
          {formatInteger(listing.download_count)}
        </div>
      </div>
      <div className="package-listing-sidebar__item">
        <div className="package-listing-sidebar__label">Likes</div>
        <div className="package-listing-sidebar__content">
          {formatInteger(listing.rating_count)}
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
      <div className="package-listing-sidebar__item">
        <div className="package-listing-sidebar__label">Dependants</div>
        <div className="package-listing-sidebar__content">
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
        </div>
      </div>
    </div>
  );
}
