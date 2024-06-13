import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import {
  Alert,
  BreadCrumbs,
  Button,
  CyberstormLink,
  Dialog,
  Icon,
  PageHeader,
  Tag,
  TextInput,
} from "@thunderstore/cyberstorm";
import headerStyles from "./headerPackageDetailLayout.module.css";
import headerManagementStyles from "./headerPackageManagementForm.module.css";
import sidebarStyles from "./sidebarPackageDetailsLayout.module.css";
import tabsStyles from "./Tabs.module.css";
import styles from "./mainPackageLayout.module.css";
import rootStyles from "../RootLayout.module.css";
import { getDapper } from "cyberstorm/dapper/sessionUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ApiError } from "@thunderstore/thunderstore-api";
import { ThunderstoreLogo } from "@thunderstore/cyberstorm/src/svg/svg";
import {
  faCircleExclamation,
  faCog,
  faArrowUpRight,
  faUsers,
  faDonate,
  faDownload,
  faThumbsUp,
  // faFlag,
  faBoxes,
  faFileLines,
  faFilePlus,
  faCodeBranch,
} from "@fortawesome/pro-solid-svg-icons";
import { WrapperCard } from "@thunderstore/cyberstorm/src/components/WrapperCard/WrapperCard";
import Meta from "./components/Meta/Meta";
import TagList from "./components/TagList/TagList";
import Dependencies from "./components/Dependencies/Dependencies";
import TeamMembers from "./components/TeamMembers/TeamMembers";
import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";

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
        listing: await dapper.getPackageListingDetails(
          params.communityId,
          params.namespaceId,
          params.packageId
        ),
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
        listing: await dapper.getPackageListingDetails(
          params.communityId,
          params.namespaceId,
          params.packageId
        ),
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
  const { community, listing } = useLoaderData<
    typeof loader | typeof clientLoader
  >();
  const location = useLocation();

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
              <div className={headerManagementStyles.root}>
                <div className={headerManagementStyles.section}>
                  <Alert
                    icon={<FontAwesomeIcon icon={faCircleExclamation} />}
                    content={
                      "Changes might take several minutes to show publicly! Info shown below is always up to date."
                    }
                    variant="info"
                  />
                  <div className={headerManagementStyles.title}>
                    Package status
                  </div>
                  <div className={headerManagementStyles.statusTag}>
                    <Tag
                      size="medium"
                      label={listing.is_deprecated ? "DEPRECATED" : "ACTIVE"}
                      colorScheme={listing.is_deprecated ? "yellow" : "success"}
                    />
                  </div>
                </div>
                <div className={headerManagementStyles.section}>
                  <div className={headerManagementStyles.title}>
                    Edit categories
                  </div>
                  <TextInput />
                </div>
                <div className={headerManagementStyles.footer}>
                  {listing.is_deprecated ? (
                    <Button.Root paddingSize="large" colorScheme="default">
                      <Button.ButtonLabel>Undeprecate</Button.ButtonLabel>
                    </Button.Root>
                  ) : (
                    <Button.Root paddingSize="large" colorScheme="warning">
                      <Button.ButtonLabel>Deprecate</Button.ButtonLabel>
                    </Button.Root>
                  )}
                  <Button.Root paddingSize="large" colorScheme="success">
                    <Button.ButtonLabel>Save changes</Button.ButtonLabel>
                  </Button.Root>
                </div>
              </div>
            </Dialog.Root>
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
                <Icon inline wrapperClasses={styles.icon}>
                  <FontAwesomeIcon icon={faFileLines} />
                </Icon>
                <span className={tabsStyles.label}>Details</span>
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
                  <Icon inline wrapperClasses={styles.icon}>
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
                <Icon inline wrapperClasses={styles.icon}>
                  <FontAwesomeIcon icon={faCodeBranch} />
                </Icon>
                <span className={tabsStyles.label}>Versions</span>
              </CyberstormLink>
            </div>
            <Outlet />
          </div>
          <div className={sidebarStyles.root}>
            <div className={sidebarStyles.buttons}>
              <a href={listing.download_url} className={sidebarStyles.download}>
                <DownloadButton />
              </a>
              <DonateButton onClick={TODO} />
              <LikeButton onClick={TODO} />
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
                headerIcon={
                  <Icon>
                    <FontAwesomeIcon icon={faBoxes} />
                  </Icon>
                }
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

const TODO = () => Promise.resolve();

interface Clickable {
  onClick: () => Promise<void>;
}

const LikeButton = (props: Clickable) => (
  <Button.Root
    onClick={props.onClick}
    tooltipText="Like"
    colorScheme="primary"
    paddingSize="mediumSquare"
  >
    <Button.ButtonIcon>
      <FontAwesomeIcon icon={faThumbsUp} />
    </Button.ButtonIcon>
  </Button.Root>
);

const DonateButton = (props: Clickable) => (
  <Button.Root
    onClick={props.onClick}
    tooltipText="Donate to author"
    colorScheme="primary"
    paddingSize="mediumSquare"
  >
    <Button.ButtonIcon>
      <FontAwesomeIcon icon={faDonate} />
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
