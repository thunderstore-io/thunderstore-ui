import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import {
  Await,
  Outlet,
  useLoaderData,
  useLocation, // useRevalidator,
  useOutletContext,
} from "react-router";
import {
  Drawer,
  Heading,
  Modal,
  NewAlert,
  NewBreadCrumbs,
  NewBreadCrumbsLink,
  NewButton,
  NewIcon,
  NewLink,
  NewSelect,
  NewTag,
  NewTextInput,
  Tabs,
} from "@thunderstore/cyberstorm";
import "./packageListing.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ApiError,
  fetchPackagePermissions,
  packageListingApprove,
  packageListingReject,
  packageListingReport,
  PackageListingReportRequestData,
  RequestConfig,
} from "@thunderstore/thunderstore-api";
import { ThunderstoreLogo } from "@thunderstore/cyberstorm/src/svg/svg";
import {
  faUsers,
  faHandHoldingHeart,
  faDownload,
  faThumbsUp,
  faWarning,
  faCaretRight,
  faScaleBalanced,
  // faList,
  // faBoxOpen,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import TeamMembers from "./components/TeamMembers/TeamMembers";
import {
  ReactElement,
  Suspense,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { useHydrated } from "remix-utils/use-hydrated";
import { PackageLikeAction } from "@thunderstore/cyberstorm-forms";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";
import {
  faArrowUpRight,
  // faFlagSwallowtail,
  faLips,
} from "@fortawesome/pro-solid-svg-icons";
import { RelativeTime } from "@thunderstore/cyberstorm/src/components/RelativeTime/RelativeTime";
import {
  formatFileSize,
  formatInteger,
  formatToDisplayName,
} from "@thunderstore/cyberstorm/src/utils/utils";
import { DapperTs } from "@thunderstore/dapper-ts";
import { OutletContextShape } from "~/root";
import { CopyButton } from "~/commonComponents/CopyButton/CopyButton";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import {
  getPackagePermissions,
  getPackageWiki,
} from "@thunderstore/dapper-ts/src/methods/package";
import { useToast } from "@thunderstore/cyberstorm/src/newComponents/Toast/Provider";
import { ApiAction } from "@thunderstore/ts-api-react-actions";
import { TagVariants } from "@thunderstore/cyberstorm-theme/src/components";
import { SelectOption } from "@thunderstore/cyberstorm/src/newComponents/Select/Select";
import { useStrongForm } from "cyberstorm/utils/StrongForm/useStrongForm";
import { isPromise } from "cyberstorm/utils/typeChecks";

export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
  return [
    {
      title: data
        ? `${formatToDisplayName(data.listing.name)} | Thunderstore - The ${data
            ?.community.name} Mod Database`
        : "Thunderstore The Mod Database",
    },
    { name: "description", content: data?.listing.description },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:url",
      content: `${import.meta.env.VITE_SITE_URL}${location.pathname}`,
    },
    {
      property: "og:title",
      content: data
        ? `${formatToDisplayName(data.listing.name)} by ${
            data.listing.namespace
          }`
        : undefined,
    },
    {
      property: "og:description",
      content: data?.listing.description,
    },
    {
      property: "og:image:width",
      content: "256",
    },
    {
      property: "og:image:height",
      content: "256",
    },
    {
      property: "og:image",
      content: data?.listing.icon_url,
    },
    {
      property: "og:site_name",
      content: "Thunderstore",
    },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
    const dapper = new DapperTs(() => {
      return {
        apiHost: publicEnvVariables.VITE_API_URL,
        sessionId: undefined,
      };
    });

    let wiki: Awaited<ReturnType<typeof getPackageWiki>> | undefined;

    try {
      wiki = await dapper.getPackageWiki(params.namespaceId, params.packageId);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.response.status === 404) {
          wiki = undefined;
        } else {
          wiki = undefined;
          console.error("Error fetching package wiki:", error);
        }
      }
    }

    return {
      community: await dapper.getCommunity(params.communityId),
      communityFilters: await dapper.getCommunityFilters(params.communityId),
      listing: await dapper.getPackageListingDetails(
        params.communityId,
        params.namespaceId,
        params.packageId
      ),
      team: await dapper.getTeamDetails(params.namespaceId),
      permissions: undefined,
      wiki: wiki,
    };
  }
  throw new Response("Package not found", { status: 404 });
}

// TODO: Needs to check if package is available for the logged in user
export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    const tools = getSessionTools();
    const dapper = new DapperTs(() => {
      return {
        apiHost: tools?.getConfig().apiHost,
        sessionId: tools?.getConfig().sessionId,
      };
    });

    // We do some trickery right here to prevent unnecessary request when the user is not logged in
    let permissionsPromise = undefined;
    const cu = await tools.getSessionCurrentUser();
    if (cu.username) {
      const wrapperPromise =
        Promise.withResolvers<
          Awaited<ReturnType<typeof getPackagePermissions>>
        >();
      dapper
        .getPackagePermissions(
          params.communityId,
          params.namespaceId,
          params.packageId
        )
        .then(wrapperPromise.resolve, wrapperPromise.reject);
      permissionsPromise = wrapperPromise.promise;
    }
    return {
      community: await dapper.getCommunity(params.communityId),
      communityFilters: await dapper.getCommunityFilters(params.communityId),
      listing: await dapper.getPackageListingDetails(
        params.communityId,
        params.namespaceId,
        params.packageId
      ),
      team: await dapper.getTeamDetails(params.namespaceId),
      permissions: permissionsPromise,
      wiki: dapper.getPackageWiki(params.namespaceId, params.packageId),
    };
  }
  throw new Response("Package not found", { status: 404 });
}

clientLoader.hydrate = true;

export default function PackageListing() {
  const { community, listing, team, permissions, wiki } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  const location = useLocation();

  const outletContext = useOutletContext() as OutletContextShape;
  const currentUser = outletContext.currentUser;
  const config = outletContext.requestConfig;
  const domain = outletContext.domain;
  const dapper = outletContext.dapper;

  const [isLiked, setIsLiked] = useState(false);
  const toast = useToast();

  const fetchAndSetRatedPackages = async () => {
    const rp = await dapper.getRatedPackages();
    setIsLiked(
      rp.rated_packages.includes(`${listing.namespace}-${listing.name}`)
    );
  };

  useEffect(() => {
    if (currentUser?.username) {
      fetchAndSetRatedPackages();
    }
  }, [currentUser]);

  const isHydrated = useHydrated();
  const startsHydrated = useRef(isHydrated);

  // START: For sidebar meta dates
  const [lastUpdated, setLastUpdated] = useState<ReactElement | undefined>(
    <RelativeTime time={listing.last_updated} suppressHydrationWarning />
  );
  const [firstUploaded, setFirstUploaded] = useState<ReactElement | undefined>(
    <RelativeTime time={listing.datetime_created} suppressHydrationWarning />
  );

  // This will be loaded 2 times in development because of:
  // https://react.dev/reference/react/StrictMode
  // If strict mode is removed from the entry.client.tsx, this should only run once
  useEffect(() => {
    if (!startsHydrated.current && isHydrated) return;
    setLastUpdated(
      <RelativeTime time={listing.last_updated} suppressHydrationWarning />
    );
    setFirstUploaded(
      <RelativeTime time={listing.datetime_created} suppressHydrationWarning />
    );
  }, []);
  // END: For sidebar meta dates

  // Sidebar helpers
  const mappedPackageTagList = listing.categories.map((category) => {
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

  const currentTab = location.pathname.split("/")[6] || "details";

  // TODO: Enable when APIs are available
  function managementTools(
    packagePermissions: Awaited<ReturnType<typeof fetchPackagePermissions>>
  ) {
    return (
      <div className="package-listing-management-tools">
        {packagePermissions.permissions.can_moderate ? (
          <div className="package-listing-management-tools__island">
            {packagePermissions.permissions.can_moderate ? (
              <Modal
                popoverId={"reviewPackage"}
                csSize="small"
                trigger={
                  <NewButton
                    csSize="small"
                    popoverTarget="reviewPackage"
                    popoverTargetAction="show"
                  >
                    <NewIcon csMode="inline" noWrapper>
                      <FontAwesomeIcon icon={faScaleBalanced} />
                    </NewIcon>
                    Review Package
                  </NewButton>
                }
              >
                <ReviewPackageForm
                  communityId={listing.community_identifier}
                  namespaceId={listing.namespace}
                  packageId={listing.name}
                  toast={toast}
                  reviewStatusColor={"orange"}
                  reviewStatus={"Skibidied"}
                  config={outletContext.requestConfig}
                />
              </Modal>
            ) : null}
            {/* {packagePermissions.permissions.can_view_listing_admin_page ? (
              <NewButton
                csSize="small"
                csVariant="secondary"
                primitiveType="link"
                href={`${
                  import.meta.env.VITE_SITE_URL
                }/djangoadmin/community/packagelisting/206/change/`}
              >
                <NewIcon csMode="inline" noWrapper>
                  <FontAwesomeIcon icon={faList} />
                </NewIcon>
                Listing admin
                <NewIcon csMode="inline" noWrapper>
                  <FontAwesomeIcon icon={faArrowUpRight} />
                </NewIcon>
              </NewButton>
            ) : null}
            {packagePermissions.permissions.can_view_package_admin_page ? (
              <NewButton
                csSize="small"
                csVariant="secondary"
                primitiveType="link"
                href={`${
                  import.meta.env.VITE_SITE_URL
                }/djangoadmin/repository/package/16/change/`}
              >
                <NewIcon csMode="inline" noWrapper>
                  <FontAwesomeIcon icon={faBoxOpen} />
                </NewIcon>
                Package admin
                <NewIcon csMode="inline" noWrapper>
                  <FontAwesomeIcon icon={faArrowUpRight} />
                </NewIcon>
              </NewButton>
            ) : null} */}
          </div>
        ) : null}
        {packagePermissions.permissions.can_manage ? (
          <div className="package-listing-management-tools__island">
            <NewButton
              csSize="small"
              primitiveType="cyberstormLink"
              linkId="PackageEdit"
              community={packagePermissions.package.community_id}
              namespace={packagePermissions.package.namespace_id}
              package={packagePermissions.package.package_name}
            >
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faCog} />
              </NewIcon>
              Manage Package
            </NewButton>
          </div>
        ) : null}
      </div>
    );
  }

  const likeAction = PackageLikeAction({
    isLoggedIn: Boolean(currentUser?.username),
    dataUpdateTrigger: fetchAndSetRatedPackages,
    config: config,
  });

  const actions = (
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
      <NewButton
        primitiveType="button"
        onClick={() =>
          likeAction(
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
      {/* <NewButton
        // primitiveType="button"
        tooltipText="Report"
        csVariant={"secondary"}
        csSize="big"
        csModifiers={["only-icon"]}
        popoverTarget="reportPackage"
        popoverTargetAction="show"
      >
        <NewIcon csMode="inline" noWrapper>
          <FontAwesomeIcon icon={faFlagSwallowtail} />
        </NewIcon>
      </NewButton> */}
    </div>
  );

  const packageMeta = (
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

  const packageBoxes = (
    <>
      {mappedPackageTagList.length > 0 ||
      listing.is_deprecated ||
      listing.is_nsfw ? (
        <div className="package-listing-sidebar__categories">
          <div className="package-listing-sidebar__header">
            <Heading csLevel="4" csSize="4">
              Categories
            </Heading>
          </div>
          {mappedPackageTagList.length > 0 ? (
            <div className="package-listing-sidebar__body">
              {mappedPackageTagList}
            </div>
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

  const canAccessWikiTabPromise = Promise.withResolvers<boolean>();
  if (wiki && isPromise(wiki)) {
    wiki
      .then(async (a) => {
        if (a.pages.length > 0) {
          canAccessWikiTabPromise.resolve(true);
        } else {
          if ((await permissions)?.permissions.can_manage) {
            canAccessWikiTabPromise.resolve(true);
          } else {
            canAccessWikiTabPromise.resolve(false);
          }
        }
      })
      .catch(async () => {
        if ((await permissions)?.permissions.can_manage) {
          canAccessWikiTabPromise.resolve(true);
        } else {
          canAccessWikiTabPromise.resolve(false);
        }
      });
  } else {
    if (permissions) {
      permissions.then((a) => {
        if (a?.permissions.can_manage) {
          canAccessWikiTabPromise.resolve(true);
        } else {
          canAccessWikiTabPromise.resolve(false);
        }
      });
    } else {
      canAccessWikiTabPromise.resolve(false);
    }
  }

  return (
    <>
      <div className="package-community__background">
        {community.hero_image_url ? (
          <img
            src={community.hero_image_url}
            alt={community.name}
            className="package-community__background-image"
          />
        ) : null}
        <div className="package-community__background-tint" />
      </div>
      <div className="container container--y container--full">
        <section className="package-listing__package-section">
          <Suspense>
            <Await resolve={permissions}>
              {(resolvedValue) =>
                resolvedValue ? (
                  <div className="package-listing__actions">
                    {managementTools(resolvedValue)}
                  </div>
                ) : null
              }
            </Await>
          </Suspense>
          <NewBreadCrumbs>
            <NewBreadCrumbsLink
              primitiveType="cyberstormLink"
              linkId="Communities"
              csVariant="cyber"
            >
              Communities
            </NewBreadCrumbsLink>
            <NewBreadCrumbsLink
              primitiveType="cyberstormLink"
              linkId="Community"
              community={community.identifier}
              csVariant="cyber"
            >
              {community.name}
            </NewBreadCrumbsLink>
            <NewBreadCrumbsLink
              primitiveType="cyberstormLink"
              linkId="Team"
              community={community.identifier}
              team={listing.namespace}
              csVariant="cyber"
            >
              {listing.namespace}
            </NewBreadCrumbsLink>

            <span>
              <span>{formatToDisplayName(listing.name)}</span>
            </span>
          </NewBreadCrumbs>
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
              {/* Report modal is here, so that it can be reused in both desktop on mobile */}
              {/* <Modal popoverId={"reportPackage"} csSize="small">
                <ReportPackageForm
                  // communityId={listing.community_identifier}
                  // namespaceId={listing.namespace}
                  // packageId={listing.name}
                  // id={listing.id}
                  id={"206"}
                  toast={toast}
                  config={outletContext.requestConfig}
                />
              </Modal> */}
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
                  {packageMeta}
                  {packageBoxes}
                </Drawer>
                {actions}
              </div>
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
                <Suspense
                  fallback={
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
                      disabled={true}
                    >
                      Wiki
                    </NewLink>
                  }
                >
                  <Await
                    resolve={canAccessWikiTabPromise.promise}
                    errorElement={
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
                        disabled={true}
                      >
                        Wiki
                      </NewLink>
                    }
                  >
                    {(resolvedValue) => {
                      return (
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
                          disabled={!resolvedValue}
                        >
                          Wiki
                        </NewLink>
                      );
                    }}
                  </Await>
                </Suspense>
                <NewLink
                  key="changelog"
                  primitiveType="cyberstormLink"
                  linkId="PackageChangelog"
                  community={listing.community_identifier}
                  namespace={listing.namespace}
                  package={listing.name}
                  aria-current={currentTab === "changelog"}
                  rootClasses={`tabs-item${
                    currentTab === "changelog" ? " tabs-item--current" : ""
                  }`}
                  disabled={!listing.has_changelog}
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
                  href={`${domain}/c/${listing.community_identifier}/p/${listing.namespace}/${listing.name}/source`}
                  primitiveType="link"
                  aria-current={currentTab === "source"}
                  rootClasses={`tabs-item${
                    currentTab === "source" ? " tabs-item--current" : ""
                  }`}
                >
                  Analysis{" "}
                  <NewIcon csMode="inline" noWrapper>
                    <FontAwesomeIcon icon={faArrowUpRight} />
                  </NewIcon>
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
                href={listing.install_url}
              >
                <NewIcon csMode="inline">
                  <ThunderstoreLogo />
                </NewIcon>
                Install
              </NewButton>
              <div className="package-listing-sidebar__main">
                {actions}
                {packageMeta}
              </div>
              {packageBoxes}
            </aside>
          </div>
        </section>
      </div>
    </>
  );
}

function ReviewPackageForm(props: {
  communityId: string;
  namespaceId: string;
  packageId: string;
  reviewStatus: string;
  reviewStatusColor: TagVariants;
  config: () => RequestConfig;
  toast: ReturnType<typeof useToast>;
}) {
  const {
    communityId,
    namespaceId,
    packageId,
    reviewStatus,
    reviewStatusColor,
    toast,
    config,
  } = props;
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [internalNotes, setInternalNotes] = useState<string>("");
  const rejectPackageAction = ApiAction({
    endpoint: packageListingReject,
    onSubmitSuccess: () => {
      toast.addToast({
        csVariant: "success",
        children: `Package rejected`,
        duration: 4000,
      });
    },
    onSubmitError: (error) => {
      toast.addToast({
        csVariant: "danger",
        children: `Error occurred: ${error.message || "Unknown error"}`,
        duration: 8000,
      });
    },
  });

  const approvePackageAction = ApiAction({
    endpoint: packageListingApprove,
    onSubmitSuccess: () => {
      toast.addToast({
        csVariant: "success",
        children: `Package approved`,
        duration: 4000,
      });
    },
    onSubmitError: (error) => {
      toast.addToast({
        csVariant: "danger",
        children: `Error occurred: ${error.message || "Unknown error"}`,
        duration: 8000,
      });
    },
  });

  return (
    <div className="modal-content">
      <div className="modal-content__header">Review Package</div>
      <div className="modal-content__body review-package__body">
        <NewAlert csVariant="info">
          Changes might take several minutes to show publicly! Info shown below
          is always up to date.
        </NewAlert>
        <div className="review-package__block">
          <p className="review-package__label">Review status</p>
          <NewTag csVariant={reviewStatusColor} csModifiers={["dark"]}>
            {reviewStatus}
          </NewTag>
        </div>
        <div className="review-package__block">
          <p className="review-package__label">
            Reject reason (saved on reject)
          </p>
          <NewTextInput
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Invalid submission"
            csSize="textarea"
            rootClasses="review-package__textarea"
          />
        </div>
        <div className="review-package__block">
          <p className="review-package__label">Internal notes</p>
          <NewTextInput
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            placeholder=".exe requires manual review"
            csSize="textarea"
            rootClasses="review-package__textarea"
          />
        </div>
      </div>
      <div className="modal-content__footer review-package__footer">
        <NewButton
          csVariant="danger"
          onClick={() =>
            rejectPackageAction({
              config: config,
              params: {
                community: communityId,
                namespace: namespaceId,
                package: packageId,
              },
              queryParams: {},
              data: {
                rejection_reason: rejectionReason,
                internal_notes: internalNotes ? internalNotes : null,
              },
            })
          }
        >
          Reject
        </NewButton>
        <NewButton
          csVariant="success"
          onClick={() =>
            approvePackageAction({
              config: config,
              params: {
                community: communityId,
                namespace: namespaceId,
                package: packageId,
              },
              queryParams: {},
              data: {
                internal_notes: internalNotes ? internalNotes : null,
              },
            })
          }
        >
          Approve
        </NewButton>
      </div>
    </div>
  );
}

ReviewPackageForm.displayName = "ReviewPackageForm";

const reportOptions: SelectOption<
  | "Spam"
  | "Malware"
  | "Reupload"
  | "CopyrightOrLicense"
  | "WrongCommunity"
  | "WrongCategories"
  | "Other"
>[] = [
  { value: "Spam", label: "Spam" },
  { value: "Malware", label: "Malware" },
  { value: "Reupload", label: "Reupload" },
  { value: "CopyrightOrLicense", label: "Copyright Or License" },
  { value: "WrongCommunity", label: "Wrong Community" },
  { value: "WrongCategories", label: "Wrong Categories" },
  { value: "Other", label: "Other" },
];

function ReportPackageForm(props: {
  // communityId: string;
  // namespaceId: string;
  // packageId: string;
  id: string;
  config: () => RequestConfig;
  toast: ReturnType<typeof useToast>;
}) {
  const {
    // communityId,
    // namespaceId,
    // packageId,
    id,
    toast,
    config,
  } = props;

  function formFieldUpdateAction(
    state: PackageListingReportRequestData,
    action: {
      field: keyof PackageListingReportRequestData;
      value: PackageListingReportRequestData[keyof PackageListingReportRequestData];
    }
  ) {
    return {
      ...state,
      [action.field]: action.value,
    };
  }

  const [formInputs, updateFormFieldState] = useReducer(formFieldUpdateAction, {
    reason: "Other",
    description: "",
  });

  type SubmitorOutput = Awaited<ReturnType<typeof packageListingReport>>;

  async function submitor(data: typeof formInputs): Promise<SubmitorOutput> {
    return await packageListingReport({
      config: config,
      params: { id: id },
      queryParams: {},
      data: { reason: data.reason, description: data.description },
    });
  }

  type InputErrors = {
    [key in keyof typeof formInputs]?: string | string[];
  };

  const strongForm = useStrongForm<
    typeof formInputs,
    PackageListingReportRequestData,
    Error,
    SubmitorOutput,
    Error,
    InputErrors
  >({
    inputs: formInputs,
    submitor,
    onSubmitSuccess: () => {
      toast.addToast({
        csVariant: "success",
        children: `Package reported`,
        duration: 4000,
      });
    },
    onSubmitError: (error) => {
      toast.addToast({
        csVariant: "danger",
        children: `Error occurred: ${error.message || "Unknown error"}`,
        duration: 8000,
      });
    },
  });

  return (
    <div className="modal-content">
      <div className="modal-content__header">Report Package</div>
      <div className="modal-content__body report-package__body">
        <div className="report-package__block">
          <p className="report-package__label">Reason</p>
          <NewSelect
            name={"role"}
            options={reportOptions}
            placeholder="Please select..."
            value={formInputs.reason}
            onChange={(value) => {
              updateFormFieldState({ field: "reason", value: value });
            }}
            id="role"
          />
        </div>
        <div className="report-package__block">
          <p className="report-package__label">
            Additional information (optional)
          </p>
          <NewTextInput
            value={formInputs.description || ""}
            onChange={(e) => {
              updateFormFieldState({
                field: "description",
                value: e.target.value,
              });
            }}
            placeholder="Invalid submission"
            csSize="textarea"
            rootClasses="report-package__textarea"
          />
        </div>
      </div>
      <div className="modal-content__footer report-package__footer">
        <NewButton csVariant="success" onClick={strongForm.submit}>
          Submit
        </NewButton>
      </div>
    </div>
  );
}

ReportPackageForm.displayName = "ReportPackageForm";
