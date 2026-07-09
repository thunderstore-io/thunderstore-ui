import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faCaretRight,
  faUsers,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import { faArrowUpRight, faLips } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CommunityPromo } from "app/commonComponents/CommunityPromo/CommunityPromo";
import { PageHeader } from "app/commonComponents/PageHeader/PageHeader";
import type { ReportPackageFormProps } from "app/p/components/ReportPackage/ReportPackageForm";
import { useReportPackage } from "app/p/components/ReportPackage/useReportPackage";
import { type OutletContextShape } from "app/root";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { getDapperForRequest } from "cyberstorm/utils/dapperSingleton";
import { getApiHostForSsr, getCanonicalUrl } from "cyberstorm/utils/env";
import { gatedSsr404 } from "cyberstorm/utils/gatedSsr";
import { createSeo } from "cyberstorm/utils/meta";
import { ssrLoader } from "cyberstorm/utils/ssrLoader";
import {
  type ReactElement,
  Suspense,
  useCallback,
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
} from "react-router";
import { useHydrated } from "remix-utils/use-hydrated";

import {
  CopyButton,
  Drawer,
  Heading,
  NewAlert,
  NewIcon,
  NewLink,
  NewTag,
  RelativeTime,
  SkeletonBox,
  Tabs,
  formatFileSize,
  formatInteger,
  formatToDisplayName,
  useToast,
} from "@thunderstore/cyberstorm";
import { PackageLikeAction } from "@thunderstore/cyberstorm-forms";
import { DapperTs, type DapperTsInterface } from "@thunderstore/dapper-ts";

import type { Route } from "./+types/packageListing";
import { PackageActions } from "./components/PackageListing/PackageActions";
import { PackageListingManagement } from "./components/PackageListing/PackageListingManagement";
import {
  getPackageListingStatusWhenNeeded,
  getPrivateListing,
  getPublicListing,
  getUserPermissions,
  isGithubUrl,
} from "./listingUtils";
import "./packageListing.css";

export { RouteErrorBoundary as ErrorBoundary } from "app/commonComponents/ErrorBoundary";

type PackageListingOutletContext = OutletContextShape & {
  packageDownloadUrl?: string;
};

export const loader = ssrLoader(
  async ({ params, request }: Route.LoaderArgs) => {
    const { communityId, namespaceId, packageId } = params;

    if (!communityId || !namespaceId || !packageId) {
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
    });

    if (!listing) {
      // The listing may exist but be hidden from this anonymous request,
      // e.g. rejected listings are still visible to moderators and to the
      // package's team members. Return a gated 404 instead of throwing so
      // the clientLoader gets to retry with the user's session attached.
      // The community and team are public, so resolve them here too — the
      // page shell and breadcrumbs render during SSR; only the gated
      // listing and the user-specific fields are deferred to the client.
      const [community, team] = await Promise.all([
        dapper.getCommunity(communityId),
        dapper.getTeamDetails(namespaceId),
      ]);
      return gatedSsr404({
        community,
        listing: undefined,
        listingStatus: undefined,
        team,
        permissions: undefined,
        community_identifier: communityId,
        namespace_id: namespaceId,
        package_id: packageId,
        seo: createSeo({ descriptors: [] }),
      });
    }

    const [community, team] = await Promise.all([
      dapper.getCommunity(communityId),
      dapper.getTeamDetails(namespaceId),
    ]);

    return {
      community,
      listing: listing,
      listingStatus: undefined,
      team,
      permissions: undefined,
      community_identifier: communityId,
      namespace_id: namespaceId,
      package_id: packageId,
      seo: createSeo({
        descriptors: [
          {
            title: `${formatToDisplayName(listing.name)} | Thunderstore - The ${
              community.name
            } Mod Database`,
          },
          { name: "description", content: listing.description },
          { property: "og:type", content: "website" },
          { property: "og:url", content: getCanonicalUrl(request) },
          {
            property: "og:title",
            content: `${formatToDisplayName(listing.name)} by ${
              listing.namespace
            }`,
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
  },
  { cache: true }
);

export { forwardLoaderHeaders as headers } from "cyberstorm/utils/ssrLoader";

export async function clientLoader({
  params,
  request,
}: Route.ClientLoaderArgs) {
  const { communityId, namespaceId, packageId } = params;

  if (!communityId || !namespaceId || !packageId) {
    throw new Response("Package not found", { status: 404 });
  }

  const tools = getSessionTools();
  const dapper = getDapperForRequest(request);

  const listing = await getPrivateListing(dapper, {
    communityId,
    namespaceId,
    packageId,
  });

  const listingIds = { communityId, namespaceId, packageId };
  const permissions = getUserPermissions(
    tools,
    dapper,
    communityId,
    namespaceId,
    packageId
  );

  return {
    community: dapper.getCommunity(communityId),
    listing: listing,
    listingStatus: permissions.then((resolvedPermissions) =>
      getPackageListingStatusWhenNeeded(
        tools,
        dapper,
        listingIds,
        resolvedPermissions
      )
    ),
    team: dapper.getTeamDetails(namespaceId),
    permissions,
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
    package_id,
  } = useLoaderData<typeof loader | typeof clientLoader>();

  const location = useLocation();

  const outletContext = useOutletContext() as OutletContextShape;
  const currentUser = outletContext.currentUser;
  const config = outletContext.requestConfig;
  const dapper = outletContext.dapper;

  const [isLiked, setIsLiked] = useState(false);
  const toast = useToast();

  // Lazily fetch the report form's version list: the factory runs only when the
  // modal first opens, not on every package page view. It's memoized on the
  // package identity so it stays stable across re-renders but is recreated (and
  // the cached versions reset) when navigating to a different package. A failed
  // versions fetch falls back to an empty list so the form still renders.
  const latestVersionNumber = listing?.latest_version_number;
  const formPropsFactory = useCallback(
    async (): Promise<ReportPackageFormProps> => {
      const versionsData = await dapper
        .getPackageVersions(namespace_id, package_id)
        .catch(() => []);
      return {
        community: community_identifier,
        namespace: namespace_id,
        package: package_id,
        versions: versionsData.map((v) => v.version_number),
        // On the package page the open version is the latest one.
        defaultVersion:
          latestVersionNumber ?? versionsData[0]?.version_number ?? "",
      };
    },
    // Keyed on the package identity only. `dapper` is intentionally omitted: it
    // is reconstructed on every root render (see App in root.tsx), so including
    // it would recreate the factory every render and defeat the lazy/cached
    // fetch. Its behavior is fixed by the config + the identity args listed here.
    [community_identifier, namespace_id, package_id, latestVersionNumber]
  );

  const { ReportPackageButton, ReportPackageModal } = useReportPackage({
    formPropsFactory,
    config: config,
  });

  // TODO: This needs to be fixes - listing is not a promise here
  // TODO: no need to get namespace and name from listing if we have them in params
  const fetchAndSetRatedPackages = async () => {
    const rp = await dapper.getRatedPackages();
    if (!listing) return;
    setIsLiked(
      rp.rated_packages.includes(`${listing.namespace}-${listing.name}`)
    );
  };

  useEffect(() => {
    if (currentUser?.username) {
      fetchAndSetRatedPackages();
    }
    // Keyed on username, not the currentUser object (whose identity changes every
    // revalidation), to avoid redundant refetches.
  }, [currentUser?.username]);

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
    if (!listing || (!startsHydrated.current && isHydrated)) {
      return;
    }

    // Backend rollout compat: prefer the new date fields, fall back to the
    // legacy ones the old backend still returns (see PackageListingDetails).
    const lastUpdatedTime = listing.version_created ?? listing.last_updated;
    const firstUploadedTime =
      listing.package_created ?? listing.datetime_created;

    setLastUpdated(
      lastUpdatedTime ? (
        <RelativeTime time={lastUpdatedTime} suppressHydrationWarning />
      ) : undefined
    );
    setFirstUploaded(
      firstUploadedTime ? (
        <RelativeTime time={firstUploadedTime} suppressHydrationWarning />
      ) : undefined
    );
  }, []);
  // END: For sidebar meta dates

  const currentTab = location.pathname.split("/")[6] || "details";

  const packageLikeAction = PackageLikeAction({
    isLoggedIn: Boolean(currentUser?.username),
    dataUpdateTrigger: fetchAndSetRatedPackages,
    config: config,
  });

  // TODO: Add proper loading element
  // listing is missing only for gated SSR data; the clientLoader refetches
  // it with the user's session right after hydration.
  if (!listing) {
    return <SkeletonBox />;
  }

  // TODO: some variables are available in props (communityId, namespaceId, packageId)
  return (
    <>
      <section className="package-listing__package-section">
        <PackageListingManagement
          listing={listing}
          listingStatus={listingStatus}
          permissions={permissions}
          toast={toast}
          requestConfig={config}
        />

        <div className="package-listing__main">
          <section className="package-listing__package-content-section">
            {listing.is_deprecated ? (
              <NewAlert csVariant="warning">
                This package has been deprecated and may no longer be
                maintained. We recommend looking for an alternative.
              </NewAlert>
            ) : null}

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
                      <NewIcon csMode="inline" noWrapper>
                        <FontAwesomeIcon
                          icon={
                            isGithubUrl(listing.website_url)
                              ? faGithub
                              : faArrowUpRight
                          }
                        />
                      </NewIcon>
                      {listing.website_url}
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
                installUrl={listing.install_url}
                reportPackageButton={ReportPackageButton}
                packageDetailsNarrow={
                  <PackageDetailsNarrow
                    lastUpdated={lastUpdated}
                    firstUploaded={firstUploaded}
                    listing={listing}
                    community={community}
                  />
                }
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
            <PackageActions
              downloadUrl={listing.download_url}
              team={team}
              installUrl={listing.install_url}
              reportPackageButton={ReportPackageButton}
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

            {packageMeta(lastUpdated, firstUploaded, listing)}

            <Suspense>
              <Await resolve={community}>
                {(resolvedCommunity) =>
                  packageBoxes(listing, resolvedCommunity)
                }
              </Await>
            </Suspense>
          </aside>
        </div>
      </section>

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

function PackageDetailsNarrow(props: {
  lastUpdated: ReactElement | undefined;
  firstUploaded: ReactElement | undefined;
  listing: Awaited<ReturnType<DapperTsInterface["getPackageListingDetails"]>>;
  community:
    | Promise<Awaited<ReturnType<DapperTsInterface["getCommunity"]>>>
    | Awaited<ReturnType<DapperTsInterface["getCommunity"]>>;
}) {
  const { lastUpdated, firstUploaded, listing, community } = props;

  return (
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
        {packageMeta(lastUpdated, firstUploaded, listing)}

        <Suspense fallback={<p>Loading...</p>}>
          <Await resolve={community}>
            {(resolvedCommunity) => packageBoxes(listing, resolvedCommunity)}
          </Await>
        </Suspense>
      </Drawer>
    </>
  );
}

function packageBoxes(
  listing: Awaited<ReturnType<DapperTsInterface["getPackageListingDetails"]>>,
  community: Awaited<ReturnType<DapperTsInterface["getCommunity"]>>
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
    </>
  );
}

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
