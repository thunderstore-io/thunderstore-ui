import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  Outlet,
  useLoaderData,
  useLocation,
  useOutletContext,
  // useRevalidator,
} from "@remix-run/react";
import {
  Drawer,
  Heading,
  // Modal,
  NewBreadCrumbs,
  NewBreadCrumbsLink,
  NewButton,
  NewIcon,
  NewLink,
  NewTag,
  Tabs,
} from "@thunderstore/cyberstorm";
import "./packageListing.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ApiError } from "@thunderstore/thunderstore-api";
import { ThunderstoreLogo } from "@thunderstore/cyberstorm/src/svg/svg";
import {
  // faCog,
  faUsers,
  faHandHoldingHeart,
  faDownload,
  faThumbsUp,
  faWarning,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import TeamMembers from "./components/TeamMembers/TeamMembers";
import { useEffect, useRef, useState } from "react";
import { useHydrated } from "remix-utils/use-hydrated";
import {
  // PackageDeprecateAction,
  // PackageEditForm,
  PackageLikeAction,
} from "@thunderstore/cyberstorm-forms";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";
import { faArrowUpRight, faLips } from "@fortawesome/pro-solid-svg-icons";
import { RelativeTime } from "@thunderstore/cyberstorm/src/components/RelativeTime/RelativeTime";
import {
  formatFileSize,
  formatInteger,
  formatToDisplayName,
} from "@thunderstore/cyberstorm/src/utils/utils";
import { DapperTs } from "@thunderstore/dapper-ts";
import { OutletContextShape } from "~/root";
import { CopyButton } from "~/commonComponents/CopyButton/CopyButton";
import { getPublicEnvVariables } from "cyberstorm/security/publicEnvVariables";

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
      content: `${getPublicEnvVariables(["PUBLIC_SITE_URL"]).PUBLIC_SITE_URL}${
        location.pathname
      }`,
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
    try {
      const dapper = new DapperTs(() => {
        return {
          apiHost: process.env.PUBLIC_API_URL,
          sessionId: undefined,
        };
      });
      return {
        community: await dapper.getCommunity(params.communityId),
        communityFilters: await dapper.getCommunityFilters(params.communityId),
        listing: await dapper.getPackageListingDetails(
          params.communityId,
          params.namespaceId,
          params.packageId
        ),
        team: await dapper.getTeamDetails(params.namespaceId),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Response("Package not found", { status: 404 });
      } else {
        // REMIX TODO: Add sentry
        throw error;
      }
    }
  }
  throw new Response("Package not found", { status: 404 });
}

// TODO: Needs to check if package is available for the logged in user
// export async function clientLoader({ params }: LoaderFunctionArgs) {
//   if (params.communityId && params.namespaceId && params.packageId) {
//     try {
//       const dapper = window.Dapper;
//       return {
//         community: await dapper.getCommunity(params.communityId),
//         communityFilters: await dapper.getCommunityFilters(params.communityId),
//         listing: await dapper.getPackageListingDetails(
//           params.communityId,
//           params.namespaceId,
//           params.packageId
//         ),
//         team: await dapper.getTeamDetails(params.namespaceId),
//         currentUser: await dapper.getCurrentUser(),
//       };
//     } catch (error) {
//       if (error instanceof ApiError) {
//         throw new Response("Package not found", { status: 404 });
//       } else {
//         // REMIX TODO: Add sentry
//         throw error;
//       }
//     }
//   }
//   throw new Response("Package not found", { status: 404 });
// }

export default function PackageListing() {
  // TODO: Enable when APIs are available
  // const { community, communityFilters, listing, team } =
  //   useLoaderData<typeof loader>();
  const { community, listing, team } = useLoaderData<typeof loader>();

  const location = useLocation();

  const outletContext = useOutletContext() as OutletContextShape;
  const currentUser = outletContext.currentUser;
  const config = outletContext.requestConfig;
  const domain = outletContext.domain;

  const [isLiked, setIsLiked] = useState(false);

  const fetchAndSetRatedPackages = async () => {
    const dapper = window.Dapper;
    const rp = await dapper.getRatedPackages();
    setIsLiked(
      rp.rated_packages.includes(`${listing.namespace}-${listing.name}`)
    );
  };

  // TODO: Enable when APIs are available
  // const revalidator = useRevalidator();
  // const revalidateLoaderData = async () => {
  //   if (revalidator.state === "idle") {
  //     revalidator.revalidate();
  //   }
  // };

  useEffect(() => {
    if (currentUser?.username) {
      fetchAndSetRatedPackages();
    }
  }, [currentUser]);

  const isHydrated = useHydrated();
  const startsHydrated = useRef(isHydrated);

  // START: For sidebar meta dates
  const [lastUpdated, setLastUpdated] = useState<JSX.Element | undefined>(
    <RelativeTime time={listing.last_updated} suppressHydrationWarning />
  );
  const [firstUploaded, setFirstUploaded] = useState<JSX.Element | undefined>(
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

  const currentTab = location.pathname.endsWith("/changelog")
    ? "changelog"
    : location.pathname.endsWith("/required")
      ? "required"
      : location.pathname.endsWith("/versions")
        ? "versions"
        : location.pathname.endsWith("/wiki")
          ? "wiki"
          : location.pathname.endsWith("/source")
            ? "source"
            : "details";

  // TODO: Enable when APIs are available
  // const managementTools = (
  //   <Modal
  //     popoverId="packageManagementTools"
  //     trigger={
  //       <NewButton
  //         csVariant="primary"
  //         {...{
  //           popovertarget: "packageManagementTools",
  //           popovertargetaction: "open",
  //         }}
  //       >
  //         <NewIcon csMode="inline" noWrapper>
  //           <FontAwesomeIcon icon={faCog} />
  //         </NewIcon>
  //         Manage
  //       </NewButton>
  //     }
  //   >
  //     <PackageEditForm
  //       options={communityFilters.package_categories.map((cat) => {
  //         return { label: cat.name, value: cat.slug };
  //       })}
  //       community={listing.community_identifier}
  //       namespace={listing.namespace}
  //       package={listing.name}
  //       current_categories={listing.categories}
  //       isDeprecated={listing.is_deprecated}
  //       dataUpdateTrigger={revalidateLoaderData}
  //       deprecationButton={
  //         <NewButton
  //           primitiveType="button"
  //           onClick={PackageDeprecateAction({
  //             packageName: listing.name,
  //             namespace: listing.namespace,
  //             isDeprecated: listing.is_deprecated,
  //             dataUpdateTrigger: revalidateLoaderData,
  //             config: config,
  //           })}
  //           csVariant={listing.is_deprecated ? "warning" : "primary"}
  //         >
  //           {listing.is_deprecated ? "Undeprecate" : "Deprecate"}
  //         </NewButton>
  //       }
  //       config={config}
  //     />
  //   </Modal>
  // );

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
        csVariant={isLiked ? "success" : "secondary"}
        csSize="big"
        csModifiers={["only-icon"]}
      >
        <NewIcon csMode="inline" noWrapper>
          <FontAwesomeIcon icon={faThumbsUp} />
        </NewIcon>
      </NewButton>
      {/* <ReportButton onClick={TODO} /> */}
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

  return (
    <div className="container container--y container--full layout__content">
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
        <section className="package-listing__section">
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
          {/* TODO: Admin tools // TODO: Enable when APIs are available*/}
          {/* <div className="headerActions">
              {currentUser?.teams.some(function (cuTeam) {
                return cuTeam?.name === listing.team.name;
              })
                ? managementTools
                : null}
            </div> */}
          <div className="package-listing__narrow-actions">
            <button
              {...{
                popovertarget: "packageDetailDrawer",
                popovertargetaction: "open",
              }}
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
          <div className="package-listing__content">
            <Tabs
              tabItems={[
                {
                  itemProps: {
                    key: "description",
                    primitiveType: "cyberstormLink",
                    linkId: "Package",
                    community: listing.community_identifier,
                    namespace: listing.namespace,
                    package: listing.name,
                    "aria-current": currentTab === "details",
                    children: <>Description</>,
                  },
                  current: currentTab === "details",
                },
                {
                  itemProps: {
                    key: "required",
                    primitiveType: "cyberstormLink",
                    linkId: "PackageRequired",
                    community: listing.community_identifier,
                    namespace: listing.namespace,
                    package: listing.name,
                    "aria-current": currentTab === "required",
                    children: <>Required ({listing.dependency_count})</>,
                  },
                  current: currentTab === "required",
                },
                // TODO: Once Analysis page is ready, enable it
                // {
                //   itemProps: {
                //     key: "wiki",
                //     primitiveType: "cyberstormLink",
                //     linkId: "PackageWiki",
                //     community: listing.community_identifier,
                //     namespace: listing.namespace,
                //     package: listing.name,
                //     "aria-current": currentTab === "wiki",
                //     children: <>Wiki</>,
                //   },
                //   current: currentTab === "wiki",
                // },
                {
                  itemProps: {
                    key: "wiki",
                    primitiveType: "link",
                    href: `${domain}/c/${listing.community_identifier}/p/${listing.namespace}/${listing.name}/wiki`,
                    "aria-current": currentTab === "wiki",
                    children: (
                      <>
                        Wiki
                        <NewIcon csMode="inline" noWrapper>
                          <FontAwesomeIcon icon={faArrowUpRight} />
                        </NewIcon>
                      </>
                    ),
                  },
                  current: currentTab === "wiki",
                },
                {
                  itemProps: {
                    key: "changelog",
                    primitiveType: "cyberstormLink",
                    linkId: "PackageChangelog",
                    community: listing.community_identifier,
                    namespace: listing.namespace,
                    package: listing.name,
                    "aria-current": currentTab === "changelog",
                    children: <>Changelog</>,
                    disabled: !listing.has_changelog,
                  },
                  current: currentTab === "changelog",
                },
                {
                  itemProps: {
                    key: "versions",
                    primitiveType: "cyberstormLink",
                    linkId: "PackageVersions",
                    community: listing.community_identifier,
                    namespace: listing.namespace,
                    package: listing.name,
                    "aria-current": currentTab === "versions",
                    children: <>Versions</>,
                  },
                  current: currentTab === "versions",
                  // TODO: Version count field needs to be added to the endpoint
                  // numberSlateValue: listing.versionCount,
                },
                // TODO: Once Analysis page is ready, enable it
                // {
                //   itemProps: {
                //     key: "source",
                //     primitiveType: "cyberstormLink",
                //     linkId: "PackageSource",
                //     community: listing.community_identifier,
                //     namespace: listing.namespace,
                //     package: listing.name,
                //     "aria-current": currentTab === "source",
                //     children: <>Analysis</>,
                //   },
                //   current: currentTab === "source",
                // },
                {
                  itemProps: {
                    key: "source",
                    href: `${domain}/c/${listing.community_identifier}/p/${listing.namespace}/${listing.name}/source`,
                    primitiveType: "link",
                    "aria-current": currentTab === "source",
                    children: (
                      <>
                        Analysis{" "}
                        <NewIcon csMode="inline" noWrapper>
                          <FontAwesomeIcon icon={faArrowUpRight} />
                        </NewIcon>
                      </>
                    ),
                  },
                  current: currentTab === "source",
                },
              ]}
              renderTabItem={(itemProps, numberSlate) => {
                const { key, children, ...fItemProps } = itemProps;
                return (
                  <NewLink key={key} {...fItemProps}>
                    {children}
                    {numberSlate}
                  </NewLink>
                );
              }}
            />
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
    </div>
  );
}

// const ReportButton = (props: Clickable) => (
//   <Button.Root
//     onClick={onClick}
//     tooltipText="Report"
//     colorScheme="primary"
//     paddingSize="mediumSquare"
//   >
//     <Button.ButtonIcon>
//       <FontAwesomeIcon icon={faFlag} />
//     </Button.ButtonIcon>
//   </Button.Root>
// );
