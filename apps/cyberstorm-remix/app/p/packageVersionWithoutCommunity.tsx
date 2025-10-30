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
  useRouteError,
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
import {
  memo,
  type ReactElement,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useHydrated } from "remix-utils/use-hydrated";
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
import { getTeamDetails } from "@thunderstore/dapper-ts/src/methods/team";
import { isPromise } from "cyberstorm/utils/typeChecks";
import { getPackageVersionDetails } from "@thunderstore/dapper-ts/src/methods/packageVersion";
import { throwUserFacingPayloadResponse } from "cyberstorm/utils/errors/userFacingErrorResponse";
import { handleLoaderError } from "cyberstorm/utils/errors/handleLoaderError";
import {
  FORBIDDEN_MAPPING,
  SIGN_IN_REQUIRED_MAPPING,
  createNotFoundMapping,
} from "cyberstorm/utils/errors/loaderMappings";
import { resolveRouteErrorPayload } from "cyberstorm/utils/errors/resolveRouteErrorPayload";

const packageVersionWithoutCommunityErrorMappings = [
  SIGN_IN_REQUIRED_MAPPING,
  FORBIDDEN_MAPPING,
  createNotFoundMapping(
    "Package version not found.",
    "We could not find the requested package version."
  ),
];

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId && params.packageVersion) {
    const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
    const dapper = new DapperTs(() => {
      return {
        apiHost: publicEnvVariables.VITE_API_URL,
        sessionId: undefined,
      };
    });
    try {
      const version = await dapper.getPackageVersionDetails(
        params.namespaceId,
        params.packageId,
        params.packageVersion
      );
      const team = await dapper.getTeamDetails(params.namespaceId);

      return {
        version,
        team,
      };
    } catch (error) {
      handleLoaderError(error, {
        mappings: packageVersionWithoutCommunityErrorMappings,
      });
    }
  }
  throwUserFacingPayloadResponse({
    headline: "Package not found.",
    description: "We could not find the requested package.",
    category: "not_found",
    status: 404,
  });
}

export function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId && params.packageVersion) {
    const tools = getSessionTools();
    const dapper = new DapperTs(() => {
      return {
        apiHost: tools?.getConfig().apiHost,
        sessionId: tools?.getConfig().sessionId,
      };
    });
    const version = dapper.getPackageVersionDetails(
      params.namespaceId,
      params.packageId,
      params.packageVersion
    );
    const team = dapper.getTeamDetails(params.namespaceId);

    return {
      version,
      team,
    };
  }
  throwUserFacingPayloadResponse({
    headline: "Package not found.",
    description: "We could not find the requested package.",
    category: "not_found",
    status: 404,
  });
}

/**
 * Provides user-facing fallback content when the package version (no community) route errors.
 */
export function ErrorBoundary() {
  const error = useRouteError();
  const payload = resolveRouteErrorPayload(error);

  return (
    <div className="container container--y container--full package-listing__error">
      <Heading csLevel="2" csSize="3" csVariant="primary" mode="display">
        {payload.headline}
      </Heading>
      {payload.description ? (
        <p className="package-listing__error-description">
          {payload.description}
        </p>
      ) : null}
    </div>
  );
}

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

export default function PackageVersion() {
  const { version, team } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  const location = useLocation();

  const outletContext = useOutletContext() as OutletContextShape;

  const isHydrated = useHydrated();
  const startsHydrated = useRef(isHydrated);

  // START: For sidebar meta dates
  const [firstUploaded, setFirstUploaded] = useState<
    ReactElement | undefined
  >();

  // This will be loaded 2 times in development because of:
  // https://react.dev/reference/react/StrictMode
  // If strict mode is removed from the entry.client.tsx, this should only run once
  useEffect(() => {
    if (!startsHydrated.current && isHydrated) return;
    if (isPromise(version)) {
      version.then((versionData) => {
        setFirstUploaded(
          <RelativeTime
            time={versionData.datetime_created}
            suppressHydrationWarning
          />
        );
      });
    } else {
      setFirstUploaded(
        <RelativeTime
          time={version.datetime_created}
          suppressHydrationWarning
        />
      );
    }
  }, []);
  // END: For sidebar meta dates

  const currentTab = location.pathname.split("/")[6] || "details";

  const versionAndTeamPromise = useMemo(() => Promise.all([version, team]), []);

  return (
    <>
      <Suspense>
        <Await resolve={versionAndTeamPromise}>
          {(resolvedValue) => (
            <>
              <meta
                title={`${formatToDisplayName(
                  resolvedValue[0].full_version_name
                )} | ${resolvedValue[1].name}`}
              />
              <meta name="description" content={resolvedValue[0].description} />
              <meta property="og:type" content="website" />
              <meta
                property="og:url"
                content={`${
                  getPublicEnvVariables(["VITE_BETA_SITE_URL"])
                    .VITE_BETA_SITE_URL
                }${location.pathname}`}
              />
              <meta
                property="og:title"
                content={`${formatToDisplayName(
                  resolvedValue[0].full_version_name
                )} by ${resolvedValue[0].namespace}`}
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
          <div className="package-listing__main">
            <section className="package-listing__package-content-section">
              <NewAlert csVariant="warning">
                You are viewing a potentially older version of this package.
              </NewAlert>
              <Suspense
                fallback={
                  <SkeletonBox className="package-listing__page-header-skeleton" />
                }
              >
                <Await resolve={version}>
                  {(resolvedValue) => (
                    <PageHeader
                      headingLevel="1"
                      headingSize="3"
                      image={resolvedValue.icon_url}
                      description={resolvedValue.description}
                      variant="detailed"
                      meta={
                        <>
                          <span>
                            <NewIcon csMode="inline" noWrapper>
                              <FontAwesomeIcon icon={faUsers} />
                            </NewIcon>
                            {resolvedValue.namespace}
                          </span>
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
                    <Await resolve={version}>
                      {(resolvedValue) => (
                        <>{packageMeta(firstUploaded, resolvedValue)}</>
                      )}
                    </Await>
                  </Suspense>
                </Drawer>
                <Suspense fallback={<p>Loading...</p>}>
                  <Await resolve={versionAndTeamPromise}>
                    {(resolvedValue) => (
                      <Actions
                        team={resolvedValue[1]}
                        version={resolvedValue[0]}
                      />
                    )}
                  </Await>
                </Suspense>
              </div>
              <Suspense
                fallback={
                  <SkeletonBox className="package-listing__nav-skeleton" />
                }
              >
                <Await resolve={version}>
                  {(resolvedValue) => (
                    <>
                      <Tabs>
                        <NewLink
                          key="description"
                          primitiveType="cyberstormLink"
                          linkId="PackageVersionWithoutCommunity"
                          namespace={resolvedValue.namespace}
                          package={resolvedValue.name}
                          version={resolvedValue.version_number}
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
                          linkId="PackageVersionWithoutCommunityRequired"
                          namespace={resolvedValue.namespace}
                          package={resolvedValue.name}
                          version={resolvedValue.version_number}
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
                          key="versions"
                          primitiveType="cyberstormLink"
                          linkId="PackageVersionWithoutCommunityVersions"
                          namespace={resolvedValue.namespace}
                          package={resolvedValue.name}
                          version={resolvedValue.version_number}
                          aria-current={currentTab === "versions"}
                          rootClasses={`tabs-item${
                            currentTab === "versions"
                              ? " tabs-item--current"
                              : ""
                          }`}
                        >
                          Versions
                        </NewLink>
                      </Tabs>
                    </>
                  )}
                </Await>
              </Suspense>
              <div className="package-listing__content">
                <Outlet context={outletContext} />
              </div>
            </section>
            <aside className="package-listing-sidebar">
              <Suspense
                fallback={
                  <SkeletonBox className="package-listing-sidebar__install-skeleton" />
                }
              >
                <Await resolve={version}>
                  {(resolvedValue) => (
                    <NewButton
                      csVariant="accent"
                      csSize="big"
                      rootClasses="package-listing-sidebar__install"
                      primitiveType="link"
                      href={resolvedValue.install_url || ""}
                      disabled={!resolvedValue.install_url}
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
                <Suspense
                  fallback={
                    <SkeletonBox className="package-listing-sidebar__actions-skeleton" />
                  }
                >
                  <Await resolve={versionAndTeamPromise}>
                    {(resolvedValue) => (
                      <Actions
                        team={resolvedValue[1]}
                        version={resolvedValue[0]}
                      />
                    )}
                  </Await>
                </Suspense>
                <Suspense
                  fallback={
                    <SkeletonBox className="package-listing-sidebar__skeleton" />
                  }
                >
                  <Await resolve={version}>
                    {(resolvedValue) => (
                      <>{packageMeta(firstUploaded, resolvedValue)}</>
                    )}
                  </Await>
                </Suspense>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </>
  );
}

const Actions = memo(function Actions(props: {
  team: Awaited<ReturnType<typeof getTeamDetails>>;
  version: Awaited<ReturnType<typeof getPackageVersionDetails>>;
}) {
  const { team, version } = props;
  return (
    <div className="package-listing-sidebar__actions">
      <NewButton
        primitiveType="link"
        href={version.download_url}
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

function packageMeta(
  firstUploaded: ReactElement | undefined,
  version: Awaited<ReturnType<typeof getPackageVersionDetails>>
) {
  return (
    <div className="package-listing-sidebar__meta">
      <div className="package-listing-sidebar__item">
        <div className="package-listing-sidebar__label">Date Uploaded</div>
        <div className="package-listing-sidebar__content">{firstUploaded}</div>
      </div>
      <div className="package-listing-sidebar__item">
        <div className="package-listing-sidebar__label">Downloads</div>
        <div className="package-listing-sidebar__content">
          {formatInteger(version.download_count)}
        </div>
      </div>
      <div className="package-listing-sidebar__item">
        <div className="package-listing-sidebar__label">Size</div>
        <div className="package-listing-sidebar__content">
          {formatFileSize(version.size)}
        </div>
      </div>
      <div className="package-listing-sidebar__item">
        <div className="package-listing-sidebar__label">Dependency string</div>
        <div className="package-listing-sidebar__content">
          <div className="package-listing-sidebar__dependency-string-wrapper">
            <span
              title={version.full_version_name}
              className="package-listing-sidebar__dependency-string"
            >
              {version.full_version_name}
            </span>
            <CopyButton text={version.full_version_name} />
          </div>
        </div>
      </div>
    </div>
  );
}
