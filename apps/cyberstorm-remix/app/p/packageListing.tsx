import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  Outlet,
  useLoaderData,
  useLocation,
  useRevalidator,
} from "@remix-run/react";
import {
  BreadCrumbs,
  Button,
  CyberstormLink,
  Dialog,
  Icon,
  PageHeader,
  Tag,
} from "@thunderstore/cyberstorm";
import headerStyles from "./headerPackageDetailLayout.module.css";
import sidebarStyles from "./sidebarPackageDetailsLayout.module.css";
import tabsStyles from "./Tabs.module.css";
import styles from "./mainPackageLayout.module.css";
import rootStyles from "../RootLayout.module.css";
import { getDapper } from "cyberstorm/dapper/sessionUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ApiError } from "@thunderstore/thunderstore-api";
import { ThunderstoreLogo } from "@thunderstore/cyberstorm/src/svg/svg";
import {
  faCog,
  faArrowUpRight,
  faUsers,
  faHandHoldingHeart,
  faDownload,
  faThumbsUp,
  // faFlag,
  faBoxes,
  faFileLines,
  faFilePlus,
  faCodeBranch,
  faBook,
  faCodeSimple,
} from "@fortawesome/free-solid-svg-icons";
import { WrapperCard } from "@thunderstore/cyberstorm/src/components/WrapperCard/WrapperCard";
import Meta from "./components/Meta/Meta";
import TagList from "./components/TagList/TagList";
import Dependencies from "./components/Dependencies/Dependencies";
import TeamMembers from "./components/TeamMembers/TeamMembers";
import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";
import { useEffect, useRef, useState } from "react";
import { useHydrated } from "remix-utils/use-hydrated";
import {
  PackageDeprecateAction,
  PackageEditForm,
  PackageLikeAction,
} from "@thunderstore/cyberstorm-forms";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.listing.name },
    { name: "description", content: data?.listing.description },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    try {
      const dapper = await getDapper();
      return {
        community: await dapper.getCommunity(params.communityId),
        communityFilters: await dapper.getCommunityFilters(params.communityId),
        listing: await dapper.getPackageListingDetails(
          params.communityId,
          params.namespaceId,
          params.packageId
        ),
        team: await dapper.getTeamDetails(params.namespaceId),
        currentUser: await dapper.getCurrentUser(),
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

export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    try {
      const dapper = await getDapper(true);
      return {
        community: await dapper.getCommunity(params.communityId),
        communityFilters: await dapper.getCommunityFilters(params.communityId),
        listing: await dapper.getPackageListingDetails(
          params.communityId,
          params.namespaceId,
          params.packageId
        ),
        team: await dapper.getTeamDetails(params.namespaceId),
        currentUser: await dapper.getCurrentUser(),
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

export default function Community() {
  const { community, communityFilters, listing, team, currentUser } =
    useLoaderData<typeof loader | typeof clientLoader>();
  const revalidator = useRevalidator();
  const location = useLocation();

  const rpc = currentUser.rated_packages_cyberstorm as string[];
  const [isLiked, setIsLiked] = useState(
    rpc.includes(`${listing.namespace}-${listing.name}`)
  );
  const [isRefetching, setIsRefetching] = useState(false);
  const isHydrated = useHydrated();
  const startsHydrated = useRef(isHydrated);

  useEffect(() => {
    if (!startsHydrated.current && isHydrated) return;
    if (
      currentUser.rated_packages_cyberstorm.length > 0 &&
      typeof currentUser.rated_packages_cyberstorm[0] === "string"
    ) {
      const rpc = currentUser.rated_packages_cyberstorm as string[];
      setIsLiked(rpc.includes(`${listing.namespace}-${listing.name}`));
    }
    setIsRefetching(false);
  }, [currentUser]);

  // REMIX TODO: Move current user to stand-alone loader and revalidate only currentUser
  async function useUpdateLikeStatus() {
    if (!isRefetching) {
      setIsRefetching(true);
      revalidator.revalidate();
    }
  }

  // REMIX TODO: Move current user to stand-alone loader and revalidate only currentUser
  async function useUpdatePackageData() {
    if (!isRefetching) {
      setIsRefetching(true);
      revalidator.revalidate();
    }
  }

  // Header helpers
  const packageDetailsMeta = [
    <CyberstormLink
      linkId="Team"
      key="team"
      community={listing.community_identifier}
      team={listing.namespace}
    >
      <Button.Root plain colorScheme="transparentPrimary" paddingSize="small">
        <Button.ButtonIcon>
          <FontAwesomeIcon icon={faUsers} />
        </Button.ButtonIcon>
        <Button.ButtonLabel>{listing.namespace}</Button.ButtonLabel>
      </Button.Root>
    </CyberstormLink>,
  ];

  if (listing.website_url) {
    packageDetailsMeta.push(
      <a key="website" href={listing.website_url}>
        <Button.Root plain colorScheme="transparentPrimary" paddingSize="small">
          <Button.ButtonLabel>{listing.website_url}</Button.ButtonLabel>
          <Button.ButtonIcon>
            <FontAwesomeIcon icon={faArrowUpRight} />
          </Button.ButtonIcon>
        </Button.Root>
      </a>
    );
  }

  // Sidebar helpers
  const mappedPackageTagList = listing.categories.map((category) => {
    return (
      <Tag
        colorScheme="borderless_no_hover"
        size="mediumPlus"
        key={category.name}
        label={category.name.toUpperCase()}
      />
    );
  });

  const currentTab = location.pathname.endsWith("/changelog")
    ? "changelog"
    : location.pathname.endsWith("/versions")
    ? "versions"
    : location.pathname.endsWith("/wiki")
    ? "wiki"
    : location.pathname.endsWith("/source")
    ? "source"
    : "details";

  return (
    <>
      <BreadCrumbs>
        <CyberstormLink linkId="Communities">Communities</CyberstormLink>
        <CyberstormLink linkId="Community" community={community.identifier}>
          {community.name}
        </CyberstormLink>
        <CyberstormLink linkId="Team" team={listing.namespace}>
          {listing.namespace}
        </CyberstormLink>
        {listing.name}
      </BreadCrumbs>
      <header className={rootStyles.pageHeader}>
        <div className={headerStyles.packageInfo}>
          <PageHeader
            title={listing.name}
            image={
              <img
                className={headerStyles.modImage}
                alt=""
                src={listing.icon_url}
              />
            }
            description={listing.description}
            meta={packageDetailsMeta}
          />
          <div className={headerStyles.headerActions}>
            <a
              href={listing.install_url}
              className={headerStyles.installButton}
            >
              <Button.Root plain paddingSize="huge" colorScheme="fancyAccent">
                <Button.ButtonIcon iconSize="big">
                  <ThunderstoreLogo />
                </Button.ButtonIcon>
                <Button.ButtonLabel fontSize="huge" fontWeight="800">
                  Install
                </Button.ButtonLabel>
              </Button.Root>
            </a>
            {currentUser.teams.some(function (cuTeam) {
              return cuTeam?.name === listing.team.name;
            }) ? (
              <Dialog.Root
                title="Manage Package"
                trigger={
                  <Button.Root colorScheme="primary" paddingSize="medium">
                    <Button.ButtonIcon>
                      <FontAwesomeIcon icon={faCog} />
                    </Button.ButtonIcon>
                    <Button.ButtonLabel>Manage</Button.ButtonLabel>
                  </Button.Root>
                }
              >
                {/* package management */}
                <PackageEditForm
                  options={communityFilters.package_categories.map((cat) => {
                    return { label: cat.name, value: cat.slug };
                  })}
                  community={listing.community_identifier}
                  namespace={listing.namespace}
                  package={listing.name}
                  current_categories={listing.categories}
                  isDeprecated={listing.is_deprecated}
                  packageDataUpdateTrigger={useUpdatePackageData}
                  deprecationButton={
                    <Button.Root
                      type="button"
                      onClick={PackageDeprecateAction({
                        packageName: listing.name,
                        namespace: listing.namespace,
                        isDeprecated: listing.is_deprecated,
                        packageDataUpdateTrigger: useUpdatePackageData,
                      })}
                      colorScheme={
                        listing.is_deprecated ? "warning" : "default"
                      }
                      paddingSize="large"
                    >
                      {listing.is_deprecated ? (
                        <Button.ButtonLabel>Undeprecate</Button.ButtonLabel>
                      ) : (
                        <Button.ButtonLabel>Deprecate</Button.ButtonLabel>
                      )}
                    </Button.Root>
                  }
                />
              </Dialog.Root>
            ) : null}
          </div>
        </div>
      </header>
      <main className={rootStyles.main}>
        <div className={styles.packageContainer}>
          <div className={tabsStyles.root}>
            <div className={tabsStyles.buttons}>
              <CyberstormLink
                linkId="Package"
                community={listing.community_identifier}
                namespace={listing.namespace}
                package={listing.name}
                aria-current={currentTab === "details"}
                className={classnames(
                  tabsStyles.button,
                  currentTab === "details" ? tabsStyles.active : ""
                )}
              >
                <Icon inline wrapperClasses={tabsStyles.icon}>
                  <FontAwesomeIcon icon={faFileLines} />
                </Icon>
                <span className={tabsStyles.label}>Details</span>
              </CyberstormLink>
              <CyberstormLink
                linkId="PackageWiki"
                community={listing.community_identifier}
                namespace={listing.namespace}
                package={listing.name}
                aria-current={currentTab === "wiki"}
                className={classnames(
                  tabsStyles.button,
                  currentTab === "wiki" ? tabsStyles.active : ""
                )}
              >
                <Icon inline wrapperClasses={tabsStyles.icon}>
                  <FontAwesomeIcon icon={faBook} />
                </Icon>
                <span className={tabsStyles.label}>Wiki</span>
              </CyberstormLink>
              {listing.has_changelog ? (
                <CyberstormLink
                  linkId="PackageChangelog"
                  community={listing.community_identifier}
                  namespace={listing.namespace}
                  package={listing.name}
                  aria-current={currentTab === "changelog"}
                  className={classnames(
                    tabsStyles.button,
                    currentTab === "changelog" ? tabsStyles.active : ""
                  )}
                >
                  <Icon inline wrapperClasses={tabsStyles.icon}>
                    <FontAwesomeIcon icon={faFilePlus} />
                  </Icon>
                  <span className={tabsStyles.label}>Changelog</span>
                </CyberstormLink>
              ) : null}
              <CyberstormLink
                linkId="PackageVersions"
                community={listing.community_identifier}
                namespace={listing.namespace}
                package={listing.name}
                aria-current={currentTab === "versions"}
                className={classnames(
                  tabsStyles.button,
                  currentTab === "versions" ? tabsStyles.active : ""
                )}
              >
                <Icon inline wrapperClasses={tabsStyles.icon}>
                  <FontAwesomeIcon icon={faCodeBranch} />
                </Icon>
                <span className={tabsStyles.label}>Versions</span>
              </CyberstormLink>
              <CyberstormLink
                linkId="PackageSource"
                community={listing.community_identifier}
                namespace={listing.namespace}
                package={listing.name}
                aria-current={currentTab === "source"}
                className={classnames(
                  tabsStyles.button,
                  currentTab === "source" ? tabsStyles.active : ""
                )}
              >
                <Icon inline wrapperClasses={tabsStyles.icon}>
                  <FontAwesomeIcon icon={faCodeSimple} />
                </Icon>
                <span className={tabsStyles.label}>Source</span>
              </CyberstormLink>
            </div>
            <Outlet />
          </div>
          <div className={sidebarStyles.root}>
            <div className={sidebarStyles.buttons}>
              <a href={listing.download_url} className={sidebarStyles.download}>
                <DownloadButton />
              </a>
              {team.donation_link ? (
                <DonateButton donationLink={team.donation_link} />
              ) : null}
              <Button.Root
                onClick={PackageLikeAction({
                  isLoggedIn: Boolean(currentUser.username),
                  packageName: listing.name,
                  namespace: listing.namespace,
                  isLiked: isLiked,
                  currentUserUpdateTrigger: useUpdateLikeStatus,
                })}
                tooltipText="Like"
                colorScheme={isLiked ? "likeBlue" : "primary"}
                paddingSize="mediumSquare"
              >
                <Button.ButtonIcon>
                  <FontAwesomeIcon icon={faThumbsUp} />
                </Button.ButtonIcon>
              </Button.Root>
              {/* <ReportButton onClick={TODO} /> */}
            </div>
            <Meta listing={listing} />
            {listing.categories.length > 0 ? (
              <WrapperCard
                title="Categories"
                content={
                  <div className={sidebarStyles.categories}>
                    {mappedPackageTagList}
                  </div>
                }
                headerIcon={<FontAwesomeIcon icon={faBoxes} />}
              />
            ) : null}
            <TagList listing={listing} />
            <Dependencies listing={listing} />
            <TeamMembers listing={listing} />
          </div>
        </div>
      </main>
    </>
  );
}

const DonateButton = (props: { donationLink: string }) => (
  <Button.Root
    href={props.donationLink}
    tooltipText="Donate to author"
    colorScheme="primary"
    paddingSize="mediumSquare"
  >
    <Button.ButtonIcon>
      <FontAwesomeIcon icon={faHandHoldingHeart} />
    </Button.ButtonIcon>
  </Button.Root>
);

// const ReportButton = (props: Clickable) => (
//   <Button.Root
//     onClick={props.onClick}
//     tooltipText="Report"
//     colorScheme="primary"
//     paddingSize="mediumSquare"
//   >
//     <Button.ButtonIcon>
//       <FontAwesomeIcon icon={faFlag} />
//     </Button.ButtonIcon>
//   </Button.Root>
// );

const DownloadButton = () => (
  <Button.Root plain colorScheme="primary" paddingSize="medium">
    <Button.ButtonIcon>
      <FontAwesomeIcon icon={faDownload} />
    </Button.ButtonIcon>
    <Button.ButtonLabel>Download</Button.ButtonLabel>
  </Button.Root>
);
