import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  Outlet,
  useLoaderData,
  useLocation,
  useRevalidator,
} from "@remix-run/react";
import {
  Button,
  CopyButton,
  Dialog,
  Image,
  NewBreadCrumbs,
  NewButton,
  NewIcon,
  NewLink,
  Tabs,
  Tag,
} from "@thunderstore/cyberstorm";
import "./packageListing.css";
import { getDapper } from "cyberstorm/dapper/sessionUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ApiError } from "@thunderstore/thunderstore-api";
import { ThunderstoreLogo } from "@thunderstore/cyberstorm/src/svg/svg";
import {
  faCog,
  faUsers,
  faHandHoldingHeart,
  faDownload,
  faThumbsUp,
  faBoxes,
} from "@fortawesome/free-solid-svg-icons";
import { WrapperCard } from "@thunderstore/cyberstorm/src/components/WrapperCard/WrapperCard";
import TagList from "./components/TagList/TagList";
import Dependencies from "./components/Dependencies/Dependencies";
import TeamMembers from "./components/TeamMembers/TeamMembers";
import { useEffect, useRef, useState } from "react";
import { useHydrated } from "remix-utils/use-hydrated";
import {
  PackageDeprecateAction,
  PackageEditForm,
  PackageLikeAction,
} from "@thunderstore/cyberstorm-forms";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";
import { faArrowUpRight } from "@fortawesome/pro-solid-svg-icons";
import { RelativeTime } from "@thunderstore/cyberstorm/src/components/RelativeTime/RelativeTime";
import {
  formatFileSize,
  formatInteger,
} from "@thunderstore/cyberstorm/src/utils/utils";

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

  // // Header helpers
  // const packageDetailsMeta = [
  //   <CyberstormLink
  //     linkId="Team"
  //     key="team"
  //     community={listing.community_identifier}
  //     team={listing.namespace}
  //   >
  //     <Button.Root plain colorScheme="transparentPrimary" paddingSize="small">
  //       <Button.ButtonIcon>
  //         <FontAwesomeIcon icon={faUsers} />
  //       </Button.ButtonIcon>
  //       <Button.ButtonLabel>{listing.namespace}</Button.ButtonLabel>
  //     </Button.Root>
  //   </CyberstormLink>,
  // ];

  // if (listing.website_url) {
  //   packageDetailsMeta.push(
  //     <a key="website" href={listing.website_url}>
  //       <Button.Root plain colorScheme="transparentPrimary" paddingSize="small">
  //         <Button.ButtonLabel>{listing.website_url}</Button.ButtonLabel>
  //         <Button.ButtonIcon>
  //           <FontAwesomeIcon icon={faArrowUpRight} />
  //         </Button.ButtonIcon>
  //       </Button.Root>
  //     </a>
  //   );
  // }

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
      {community.hero_image_url ? (
        <div className="nimbus-root__outlet__heroimg__wrapper">
          <div
            className="nimbus-root__outlet__heroimg"
            style={{
              backgroundImage: `url(${community.hero_image_url})`,
            }}
          />
        </div>
      ) : null}
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
      <header className="nimbus-root__page-header">
        <div>
          <PageHeader
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
                // TODO: Add intrinsic width and height
              />
            }
            description={listing.description}
            meta={
              <>
                <NewLink
                  primitiveType="cyberstormLink"
                  linkId="Team"
                  community={listing.community_identifier}
                  team={listing.namespace}
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
          <div className="headerActions">
            {/* <a
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
            </a> */}
            {/* TODO: Admin tools */}
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
      <main className="nimbus-root__main nimbus-packagelisting__main">
        <div className="nimbus-packagelisting__content">
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
                  key: "wiki",
                  primitiveType: "cyberstormLink",
                  linkId: "PackageWiki",
                  community: listing.community_identifier,
                  namespace: listing.namespace,
                  package: listing.name,
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
              {
                itemProps: {
                  key: "source",
                  primitiveType: "cyberstormLink",
                  linkId: "PackageSource",
                  community: listing.community_identifier,
                  namespace: listing.namespace,
                  package: listing.name,
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
        <div className="nimbus-packagelisting__sidebar">
          <NewButton
            csVariant="accent"
            csSize="big"
            rootClasses="nimbus-packagelisting__sidebar__install"
          >
            <NewIcon csMode="inline">
              <ThunderstoreLogo />
            </NewIcon>
            Install
          </NewButton>
          <div className="nimbus-packagelisting__sidebar__actions">
            <NewButton
              primitiveType="link"
              href={listing.download_url}
              csVariant="secondary"
              rootClasses="nimbus-packagelisting__sidebar__actions__download"
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
                isLoggedIn: Boolean(currentUser.username),
                packageName: listing.name,
                namespace: listing.namespace,
                isLiked: isLiked,
                currentUserUpdateTrigger: useUpdateLikeStatus,
              })}
              tooltipText="Like"
              icon={faThumbsUp}
              csVariant="secondary"
            />
            {/* <ReportButton onClick={TODO} /> */}
          </div>
          <div className="nimbus-packagelisting__sidebar__meta">
            <div className="nimbus-packagelisting__sidebar__meta__item nimbus-packagelisting__sidebar__meta__item--first">
              <div className="nimbus-packagelisting__sidebar__meta__item__label">
                Last Updated
              </div>
              <div className="nimbus-packagelisting__sidebar__meta__item__content">
                {lastUpdated}
              </div>
            </div>
            <div className="nimbus-packagelisting__sidebar__meta__item">
              <div className="nimbus-packagelisting__sidebar__meta__item__label">
                First Uploaded
              </div>
              <div className="nimbus-packagelisting__sidebar__meta__item__content">
                {firstUploaded}
              </div>
            </div>
            <div className="nimbus-packagelisting__sidebar__meta__item">
              <div className="nimbus-packagelisting__sidebar__meta__item__label">
                Downloads
              </div>
              <div className="nimbus-packagelisting__sidebar__meta__item__content">
                {formatInteger(listing.download_count)}
              </div>
            </div>
            <div className="nimbus-packagelisting__sidebar__meta__item">
              <div className="nimbus-packagelisting__sidebar__meta__item__label">
                Likes
              </div>
              <div className="nimbus-packagelisting__sidebar__meta__item__content">
                {formatInteger(listing.rating_count)}
              </div>
            </div>
            <div className="nimbus-packagelisting__sidebar__meta__item">
              <div className="nimbus-packagelisting__sidebar__meta__item__label">
                Size
              </div>
              <div className="nimbus-packagelisting__sidebar__meta__item__content">
                {formatFileSize(listing.size)}
              </div>
            </div>
            <div className="nimbus-packagelisting__sidebar__meta__item">
              <div className="nimbus-packagelisting__sidebar__meta__item__label">
                Dependency string
              </div>
              <div className="nimbus-packagelisting__sidebar__meta__item__content">
                <div className="nimbus-packagelisting__sidebar__meta__item__content__dependencystringwrapper">
                  <div
                    title={listing.full_version_name}
                    className="nimbus-packagelisting__sidebar__meta__item__content__dependencystring"
                  >
                    {listing.full_version_name}
                  </div>
                  <CopyButton text={listing.full_version_name} />
                </div>
              </div>
            </div>
            <div className="nimbus-packagelisting__sidebar__meta__item nimbus-packagelisting__sidebar__meta__item--last">
              <div className="nimbus-packagelisting__sidebar__meta__item__label">
                Dependants
              </div>
              <div className="nimbus-packagelisting__sidebar__meta__item__content">
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
          {listing.categories.length > 0 ? (
            <WrapperCard
              title="Categories"
              content={
                <div className="nimbus-packagelisting__sidebar__categories">
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
      </main>
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
