import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  Outlet,
  useLoaderData,
  useLocation,
  useOutletContext,
  // useRevalidator,
} from "@remix-run/react";
import {
  CopyButton,
  Heading,
  Image,
  // Modal,
  NewBreadCrumbs,
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
  faThumbTack,
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
import {
  faArrowUpRight,
  faLips,
  faSparkles,
} from "@fortawesome/pro-solid-svg-icons";
import { RelativeTime } from "@thunderstore/cyberstorm/src/components/RelativeTime/RelativeTime";
import {
  formatFileSize,
  formatInteger,
} from "@thunderstore/cyberstorm/src/utils/utils";
import { DapperTs } from "@thunderstore/dapper-ts";
import { OutletContextShape } from "~/root";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.listing.name },
    { name: "description", content: data?.listing.description },
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

export default function Community() {
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
      <NewTag key={category.name} csSize="small" csVariant="primary">
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

  return (
    <>
      <div className="ts-container ts-container--y ts-container--full nimbus-root__content">
        <NewBreadCrumbs rootClasses="nimbus-root__breadcrumbs">
          <NewLink
            primitiveType="cyberstormLink"
            linkId="Communities"
            csVariant="cyber"
          >
            Communities
          </NewLink>
          <NewLink
            primitiveType="cyberstormLink"
            linkId="Community"
            community={community.identifier}
            csVariant="cyber"
          >
            {community.name}
          </NewLink>
          <NewLink
            primitiveType="cyberstormLink"
            linkId="Team"
            team={listing.namespace}
            csVariant="cyber"
          >
            {listing.namespace}
          </NewLink>
          {listing.name}
        </NewBreadCrumbs>
        <div className="nimbus-packageListing">
          <section className="__main">
            <PageHeader
              // rootClasses="__content-header"
              heading={listing.name}
              headingLevel="1"
              headingSize="3"
              image={
                <Image
                  // rootClasses={headerStyles.modImage}
                  src={listing.icon_url}
                  cardType="package"
                  square
                  intrinsicHeight={256}
                  intrinsicWidth={256}
                />
              }
              description={listing.description}
              meta={
                <>
                  <NewLink
                    // TODO: Remove when team page is available
                    primitiveType="link"
                    href={`${domain}/c/${listing.community_identifier}/p/${listing.namespace}/`}
                    // primitiveType="cyberstormLink"
                    // linkId="Team"
                    // community={listing.community_identifier}
                    // team={listing.namespace}
                    csVariant="cyber"
                    rootClasses="nimbus-commoncomponents-page-header__meta__item"
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
                      rootClasses="nimbus-commoncomponents-page-header__meta__item"
                    >
                      {listing.website_url}
                      <NewIcon csMode="inline" noWrapper>
                        <FontAwesomeIcon icon={faArrowUpRight} />
                      </NewIcon>
                    </NewLink>
                  ) : null}
                </>
              }
            />
            {/* TODO: Admin tools // TODO: Enable when APIs are available*/}
            {/* <div className="headerActions">
              {currentUser?.teams.some(function (cuTeam) {
                return cuTeam?.name === listing.team.name;
              })
                ? managementTools
                : null}
            </div> */}
            <div className="__content">
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
                      children: <>Required</>,
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
                      children: <>Wiki</>,
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
                      children: <>Analysis</>,
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
              <Outlet />
            </div>
          </section>
          <aside className="__sidebar">
            <NewButton csVariant="accent" csSize="big" rootClasses="__install">
              <NewIcon csMode="inline">
                <ThunderstoreLogo />
              </NewIcon>
              Install
            </NewButton>
            <div className="__main">
              <div className="__actions">
                <NewButton
                  primitiveType="link"
                  href={listing.download_url}
                  csVariant="secondary"
                  rootClasses="__download"
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
                    icon={faHandHoldingHeart}
                    csVariant="secondary"
                  />
                ) : null}
                <NewButton
                  primitiveType="button"
                  onClick={PackageLikeAction({
                    isLoggedIn: Boolean(currentUser?.username),
                    packageName: listing.name,
                    namespace: listing.namespace,
                    isLiked: isLiked,
                    dataUpdateTrigger: fetchAndSetRatedPackages,
                    config: config,
                  })}
                  tooltipText="Like"
                  icon={faThumbsUp}
                  csVariant={isLiked ? "success" : "secondary"}
                />
                {/* <ReportButton onClick={TODO} /> */}
              </div>
              <div className="__meta">
                <div className="__item">
                  <div className="__label">Last Updated</div>
                  <div className="__content">{lastUpdated}</div>
                </div>
                <div className="__item">
                  <div className="__label">First Uploaded</div>
                  <div className="__content">{firstUploaded}</div>
                </div>
                <div className="__item">
                  <div className="__label">Downloads</div>
                  <div className="__content">
                    {formatInteger(listing.download_count)}
                  </div>
                </div>
                <div className="__item">
                  <div className="__label">Likes</div>
                  <div className="__content">
                    {formatInteger(listing.rating_count)}
                  </div>
                </div>
                <div className="__item">
                  <div className="__label">Size</div>
                  <div className="__content">
                    {formatFileSize(listing.size)}
                  </div>
                </div>
                <div className="__item">
                  <div className="__label">Dependency string</div>
                  <div className="__content">
                    <div className="__dependencystringwrapper">
                      <div
                        title={listing.full_version_name}
                        className="__dependencystring"
                      >
                        {listing.full_version_name}
                      </div>
                      <CopyButton text={listing.full_version_name} />
                    </div>
                  </div>
                </div>
                <div className="__item">
                  <div className="__label">Dependants</div>
                  <div className="__content">
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
            </div>
            <div className="__categories">
              <div className="__header">
                <Heading csLevel="4" csSize="4">
                  Categories
                </Heading>
              </div>
              <div className="__body">{mappedPackageTagList}</div>
              <div className="__body">
                {listing.is_pinned ? (
                  <NewTag
                    csSize="small"
                    csModifiers={["dark"]}
                    csVariant="blue"
                  >
                    <NewIcon noWrapper csMode="inline">
                      <FontAwesomeIcon icon={faThumbTack} />
                    </NewIcon>
                    Pinned
                  </NewTag>
                ) : null}
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
                  <NewTag
                    csSize="small"
                    csModifiers={["dark"]}
                    csVariant="pink"
                  >
                    <NewIcon noWrapper csMode="inline">
                      <FontAwesomeIcon icon={faLips} />
                    </NewIcon>
                    NSFW
                  </NewTag>
                ) : null}
                {Math.round(
                  (Date.now() - Date.parse(listing.last_updated)) / 86400000
                ) < 3 ? (
                  <NewTag
                    csSize="small"
                    csModifiers={["dark"]}
                    csVariant="green"
                  >
                    <NewIcon noWrapper csMode="inline">
                      <FontAwesomeIcon icon={faSparkles} />
                    </NewIcon>
                    New
                  </NewTag>
                ) : null}
              </div>
            </div>

            <TeamMembers listing={listing} domain={domain} />
          </aside>
        </div>
      </div>
    </>
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
