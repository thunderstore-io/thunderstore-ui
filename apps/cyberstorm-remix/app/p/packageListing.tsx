import {
  memo,
  type ReactElement,
  Suspense,
  useEffect,
  useMemo,
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
  type ShouldRevalidateFunctionArgs,
} from "react-router";
import { useHydrated } from "remix-utils/use-hydrated";
import {
  faUsers,
  faHandHoldingHeart,
  faDownload,
  faThumbsUp,
  faWarning,
  faCaretRight,
  faScaleBalanced,
  faCog,
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
  Modal,
  NewAlert,
  NewButton,
  NewIcon,
  NewLink,
  NewTag,
  NewTextInput,
  RelativeTime,
  SkeletonBox,
  Tabs,
  ThunderstoreLogo,
  formatFileSize,
  formatInteger,
  formatToDisplayName,
  useToast,
} from "@thunderstore/cyberstorm";
import { PackageLikeAction } from "@thunderstore/cyberstorm-forms";
import type { TagVariants } from "@thunderstore/cyberstorm-theme/src/components";
import type { CurrentUser } from "@thunderstore/dapper/types";
import { DapperTs, type DapperTsInterface } from "@thunderstore/dapper-ts";
import {
  fetchPackagePermissions,
  packageListingApprove,
  packageListingReject,
  type RequestConfig,
} from "@thunderstore/thunderstore-api";
import { ApiAction } from "@thunderstore/ts-api-react-actions";

import "./packageListing.css";

type PackageListingOutletContext = OutletContextShape & {
  packageDownloadUrl?: string;
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
    };
  }
  throw new Response("Package not found", { status: 404 });
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
    return dapper.getPackagePermissions(communityId, namespaceId, packageId);
  }
  return undefined;
}

// TODO: Needs to check if package is available for the logged in user
export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    const tools = getSessionTools();
    const dapper = new DapperTs(() => {
      return {
        apiHost: tools.getConfig().apiHost,
        sessionId: tools.getConfig().sessionId,
      };
    });

    return {
      community: dapper.getCommunity(params.communityId),
      communityFilters: dapper.getCommunityFilters(params.communityId),
      listing: dapper.getPackageListingDetails(
        params.communityId,
        params.namespaceId,
        params.packageId
      ),
      team: dapper.getTeamDetails(params.namespaceId),
      permissions: getUserPermissions(
        tools,
        dapper,
        params.communityId,
        params.namespaceId,
        params.packageId
      ),
    };
  }
  throw new Response("Package not found", { status: 404 });
}

clientLoader.hydrate = true;

export function shouldRevalidate(arg: ShouldRevalidateFunctionArgs) {
  const oldPath = arg.currentUrl.pathname.split("/");
  const newPath = arg.nextUrl.pathname.split("/");
  // If we're staying on the same package page, don't revalidate
  if (
    oldPath[2] === newPath[2] &&
    oldPath[3] === newPath[3] &&
    oldPath[5] === newPath[5]
  ) {
    return false;
  }
  return arg.defaultShouldRevalidate;
}

export default function PackageListing() {
  const { community, listing, team, permissions } = useLoaderData<
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

  const { ReportPackageButton, ReportPackageModal } = useReportPackage(
    Promise.resolve(listing).then((listingData) => ({
      community: listingData.community_identifier,
      namespace: listingData.namespace,
      package: listingData.name,
      config,
      toast,
    }))
  );

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
    if (!startsHydrated.current && isHydrated) return;
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

  const listingAndCommunityPromise = useMemo(
    () => Promise.all([listing, community]),
    []
  );

  const listingAndPermissionsPromise = useMemo(
    () => Promise.all([listing, permissions]),
    []
  );

  const listingAndTeamPromise = useMemo(() => Promise.all([listing, team]), []);

  return (
    <>
      <Suspense>
        <Await resolve={listingAndCommunityPromise}>
          {(resolvedValue) => (
            <>
              <meta
                title={`${formatToDisplayName(
                  resolvedValue[0].name
                )} | Thunderstore - The ${resolvedValue[1].name} Mod Database`}
              />
              <meta name="description" content={resolvedValue[0].description} />
              <meta property="og:type" content="website" />
              <meta
                property="og:url"
                content={`${getPublicEnvVariables(["VITE_BETA_SITE_URL"])}${
                  location.pathname
                }`}
              />
              <meta
                property="og:title"
                content={`${formatToDisplayName(resolvedValue[0].name)} by ${
                  resolvedValue[0].namespace
                }`}
              />
              <meta
                property="og:description"
                content={resolvedValue[0].description}
              />
              <meta property="og:image:width" content="256" />
              <meta property="og:image:height" content="256" />
              <meta
                property="og:image"
                content={resolvedValue[0].icon_url ?? undefined}
              />
              <meta property="og:site_name" content="Thunderstore" />
            </>
          )}
        </Await>
      </Suspense>
      <div className="container container--y container--full">
        <section className="package-listing__package-section">
          <Suspense>
            <Await resolve={listingAndPermissionsPromise}>
              {(resolvedValue) =>
                resolvedValue && resolvedValue[1] ? (
                  <div className="package-listing__actions">
                    {managementTools(
                      resolvedValue[1],
                      resolvedValue[0],
                      toast,
                      config
                    )}
                  </div>
                ) : null
              }
            </Await>
          </Suspense>
          <div className="package-listing__main">
            <section className="package-listing__package-content-section">
              <Suspense
                fallback={
                  <SkeletonBox className="package-listing__page-header-skeleton" />
                }
              >
                <Await resolve={listing}>
                  {(resolvedValue) => (
                    <PageHeader
                      headingLevel="1"
                      headingSize="3"
                      image={resolvedValue.icon_url}
                      description={resolvedValue.description}
                      variant="detailed"
                      meta={
                        <>
                          <NewLink
                            primitiveType="cyberstormLink"
                            linkId="Team"
                            community={resolvedValue.community_identifier}
                            team={resolvedValue.namespace}
                            csVariant="cyber"
                            rootClasses="page-header__meta-item"
                          >
                            <NewIcon csMode="inline" noWrapper>
                              <FontAwesomeIcon icon={faUsers} />
                            </NewIcon>
                            {resolvedValue.namespace}
                          </NewLink>
                          {resolvedValue.website_url ? (
                            <NewLink
                              primitiveType="link"
                              href={resolvedValue.website_url}
                              csVariant="cyber"
                              rootClasses="page-header__meta-item"
                            >
                              {resolvedValue.website_url}
                              <NewIcon csMode="inline" noWrapper>
                                <FontAwesomeIcon icon={faArrowUpRight} />
                              </NewIcon>
                            </NewLink>
                          ) : null}
                        </>
                      }
                    >
                      {formatToDisplayName(resolvedValue.name)}
                    </PageHeader>
                  )}
                </Await>
              </Suspense>
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
                  <Suspense fallback={<p>Loading...</p>}>
                    <Await resolve={listing}>
                      {(resolvedValue) => (
                        <>
                          {packageMeta(
                            lastUpdated,
                            firstUploaded,
                            resolvedValue
                          )}
                        </>
                      )}
                    </Await>
                  </Suspense>
                  <Suspense fallback={<p>Loading...</p>}>
                    <Await resolve={listingAndCommunityPromise}>
                      {(resolvedValue) => (
                        <>
                          {packageBoxes(
                            resolvedValue[0],
                            resolvedValue[1],
                            domain
                          )}
                        </>
                      )}
                    </Await>
                  </Suspense>
                </Drawer>
                <Suspense fallback={<p>Loading...</p>}>
                  <Await resolve={listingAndTeamPromise}>
                    {(resolvedValue) => (
                      <Actions
                        team={resolvedValue[1]}
                        listing={resolvedValue[0]}
                        isLiked={isLiked}
                        currentUser={currentUser}
                        likeUpdateTrigger={fetchAndSetRatedPackages}
                        requestConfig={config}
                      />
                    )}
                  </Await>
                </Suspense>

                {ReportPackageButton}
              </div>
              <Suspense
                fallback={
                  <SkeletonBox className="package-listing__nav-skeleton" />
                }
              >
                <Await resolve={listing}>
                  {(resolvedValue) => (
                    <>
                      <Tabs>
                        <NewLink
                          key="description"
                          primitiveType="cyberstormLink"
                          linkId="Package"
                          community={resolvedValue.community_identifier}
                          namespace={resolvedValue.namespace}
                          package={resolvedValue.name}
                          aria-current={currentTab === "details"}
                          rootClasses={`tabs-item${
                            currentTab === "details"
                              ? " tabs-item--current"
                              : ""
                          }`}
                        >
                          Details
                        </NewLink>
                        <NewLink
                          key="required"
                          primitiveType="cyberstormLink"
                          linkId="PackageRequired"
                          community={resolvedValue.community_identifier}
                          namespace={resolvedValue.namespace}
                          package={resolvedValue.name}
                          aria-current={currentTab === "required"}
                          rootClasses={`tabs-item${
                            currentTab === "required"
                              ? " tabs-item--current"
                              : ""
                          }`}
                        >
                          Required ({resolvedValue.dependency_count})
                        </NewLink>
                        <NewLink
                          key="wiki"
                          primitiveType="cyberstormLink"
                          linkId="PackageWiki"
                          community={resolvedValue.community_identifier}
                          namespace={resolvedValue.namespace}
                          package={resolvedValue.name}
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
                          community={resolvedValue.community_identifier}
                          namespace={resolvedValue.namespace}
                          package={resolvedValue.name}
                          aria-current={currentTab === "changelog"}
                          rootClasses={`tabs-item${
                            currentTab === "changelog"
                              ? " tabs-item--current"
                              : ""
                          }`}
                          disabled={!resolvedValue.has_changelog}
                        >
                          Changelog
                        </NewLink>
                        <NewLink
                          key="versions"
                          primitiveType="cyberstormLink"
                          linkId="PackageVersions"
                          community={resolvedValue.community_identifier}
                          namespace={resolvedValue.namespace}
                          package={resolvedValue.name}
                          aria-current={currentTab === "versions"}
                          rootClasses={`tabs-item${
                            currentTab === "versions"
                              ? " tabs-item--current"
                              : ""
                          }`}
                        >
                          Versions
                        </NewLink>
                        <NewLink
                          key="source"
                          primitiveType="cyberstormLink"
                          linkId="PackageSource"
                          community={resolvedValue.community_identifier}
                          namespace={resolvedValue.namespace}
                          package={resolvedValue.name}
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
                              packageDownloadUrl: resolvedValue.download_url,
                            } as PackageListingOutletContext
                          }
                        />
                      </div>
                    </>
                  )}
                </Await>
              </Suspense>
            </section>
            <aside className="package-listing-sidebar">
              <Suspense
                fallback={
                  <SkeletonBox className="package-listing-sidebar__install-skeleton" />
                }
              >
                <Await resolve={listing}>
                  {(resolvedValue) => (
                    <NewButton
                      csVariant="accent"
                      csSize="big"
                      rootClasses="package-listing-sidebar__install"
                      primitiveType="link"
                      href={resolvedValue.install_url}
                    >
                      <NewIcon csMode="inline">
                        <ThunderstoreLogo />
                      </NewIcon>
                      Install
                    </NewButton>
                  )}
                </Await>
              </Suspense>
              <div className="package-listing-sidebar__main">
                <div className="package-listing-sidebar__actions">
                  <Suspense
                    fallback={
                      <SkeletonBox className="package-listing-sidebar__actions-skeleton" />
                    }
                  >
                    <Await resolve={listingAndTeamPromise}>
                      {(resolvedValue) => (
                        <Actions
                          team={resolvedValue[1]}
                          listing={resolvedValue[0]}
                          isLiked={isLiked}
                          currentUser={currentUser}
                          likeUpdateTrigger={fetchAndSetRatedPackages}
                          requestConfig={config}
                        />
                      )}
                    </Await>
                  </Suspense>

                  {ReportPackageButton}
                </div>

                <Suspense
                  fallback={
                    <SkeletonBox className="package-listing-sidebar__skeleton" />
                  }
                >
                  <Await resolve={listing}>
                    {(resolvedValue) => (
                      <>
                        {packageMeta(lastUpdated, firstUploaded, resolvedValue)}
                      </>
                    )}
                  </Await>
                </Suspense>
              </div>
              <Suspense
                fallback={
                  <SkeletonBox className="package-listing-sidebar__boxes-skeleton" />
                }
              >
                <Await resolve={listingAndCommunityPromise}>
                  {(resolvedValue) => (
                    <>
                      {packageBoxes(resolvedValue[0], resolvedValue[1], domain)}
                    </>
                  )}
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
    <Modal
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
      titleContent="Review Package"
    >
      <Modal.Body className="review-package__body">
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
      </Modal.Body>
      <Modal.Footer className="modal-content__footer review-package__footer">
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
      </Modal.Footer>
    </Modal>
  );
}

ReviewPackageForm.displayName = "ReviewPackageForm";

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

// TODO: Enable when APIs are available
function managementTools(
  packagePermissions: Awaited<ReturnType<typeof fetchPackagePermissions>>,
  listing: Awaited<ReturnType<DapperTsInterface["getPackageListingDetails"]>>,
  toast: ReturnType<typeof useToast>,
  requestConfig: () => RequestConfig
) {
  return (
    <div className="package-listing-management-tools">
      {packagePermissions.permissions.can_moderate ? (
        <div className="package-listing-management-tools__island">
          {packagePermissions.permissions.can_moderate ? (
            <ReviewPackageForm
              communityId={listing.community_identifier}
              namespaceId={listing.namespace}
              packageId={listing.name}
              toast={toast}
              reviewStatusColor={"orange"}
              reviewStatus={"Skibidied"}
              config={requestConfig}
            />
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

function likeAction(
  currentUser: CurrentUser | undefined,
  updateTrigger: () => Promise<void>,
  requestConfig: () => RequestConfig
) {
  return PackageLikeAction({
    isLoggedIn: Boolean(currentUser?.username),
    dataUpdateTrigger: updateTrigger,
    config: requestConfig,
  });
}

const Actions = memo(function Actions(props: {
  team: Awaited<ReturnType<DapperTsInterface["getTeamDetails"]>>;
  listing: Awaited<ReturnType<DapperTsInterface["getPackageListingDetails"]>>;
  isLiked: boolean;
  currentUser: CurrentUser | undefined;
  likeUpdateTrigger: () => Promise<void>;
  requestConfig: () => RequestConfig;
}) {
  const {
    team,
    listing,
    isLiked,
    currentUser,
    likeUpdateTrigger,
    requestConfig,
  } = props;
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
          likeAction(currentUser, likeUpdateTrigger, requestConfig)(
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
