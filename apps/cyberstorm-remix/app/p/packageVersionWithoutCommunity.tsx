import { faCaretRight, faUsers } from "@fortawesome/free-solid-svg-icons";
import { faArrowUpRight } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { getApiHostForSsr } from "cyberstorm/utils/env";
import { createSeo } from "cyberstorm/utils/meta";
import { ssrLoader } from "cyberstorm/utils/ssrLoader";
import { isPromise } from "cyberstorm/utils/typeChecks";
import {
  type ReactElement,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
} from "react-router";
import { useHydrated } from "remix-utils/use-hydrated";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";
import { type OutletContextShape } from "~/root";

import {
  CopyButton,
  Drawer,
  Heading,
  NewAlert,
  NewIcon,
  NewLink,
  RelativeTime,
  SkeletonBox,
  Tabs,
  formatFileSize,
  formatInteger,
  formatToDisplayName,
} from "@thunderstore/cyberstorm";
import { DapperTs } from "@thunderstore/dapper-ts";
import { getPackageVersionDetails } from "@thunderstore/dapper-ts";

import { PackageActions } from "./components/PackageListing/PackageActions";
// import type { Route } from "./+types/packageVersionWithoutCommunity";
import "./packageListing.css";

export const loader = ssrLoader(
  async ({ params, request }: LoaderFunctionArgs) => {
    if (params.namespaceId && params.packageId && params.packageVersion) {
      const dapper = new DapperTs(() => {
        return {
          apiHost: getApiHostForSsr(),
          sessionId: undefined,
        };
      });

      const version = await dapper.getPackageVersionDetails(
        params.namespaceId,
        params.packageId,
        params.packageVersion
      );
      const team = await dapper.getTeamDetails(params.namespaceId);
      const url = new URL(request.url);

      return {
        version: version,
        team: team,
        seo: createSeo({
          descriptors: [
            {
              title: `${formatToDisplayName(version.full_version_name)} | ${
                team.name
              }`,
            },
            { name: "description", content: version.description },
            { property: "og:type", content: "website" },
            { property: "og:url", content: url.href },
            {
              property: "og:title",
              content: `${formatToDisplayName(version.full_version_name)} | ${
                team.name
              }`,
            },
            { property: "og:description", content: version.description },
            { property: "og:image", content: version.icon_url },
            { property: "og:site_name", content: "Thunderstore" },
          ],
        }),
      };
    }
    throw new Response("Package not found", { status: 404 });
  }
);

export async function clientLoader({
  params,
  serverLoader,
}: LoaderFunctionArgs & {
  serverLoader: () => ReturnType<typeof loader>;
}) {
  if (params.namespaceId && params.packageId && params.packageVersion) {
    const tools = getSessionTools();
    const dapper = new DapperTs(() => {
      return {
        apiHost: tools?.getConfig().apiHost,
        sessionId: tools?.getConfig().sessionId,
      };
    });

    const version = await dapper.getPackageVersionDetails(
      params.namespaceId,
      params.packageId,
      params.packageVersion
    );
    const team = await dapper.getTeamDetails(params.namespaceId);
    const sl = await serverLoader();

    return {
      version: version,
      team: team,
      seo: sl.seo,
    };
  }
  throw new Response("Package not found", { status: 404 });
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
                <Suspense fallback={<p>Loading...</p>}>
                  <Await resolve={versionAndTeamPromise}>
                    {([versionData, teamData]) => (
                      <PackageActions
                        downloadUrl={versionData.download_url}
                        team={teamData}
                        installUrl={versionData.install_url ?? ""}
                        installDisabled={!versionData.install_url}
                        packageDetailsNarrow={
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
                              {packageMeta(firstUploaded, versionData)}
                            </Drawer>
                          </>
                        }
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
              <div className="package-listing-sidebar__main">
                <Suspense
                  fallback={
                    <SkeletonBox className="package-listing-sidebar__actions-skeleton" />
                  }
                >
                  <Await resolve={versionAndTeamPromise}>
                    {([versionData, teamData]) => (
                      <PackageActions
                        downloadUrl={versionData.download_url}
                        team={teamData}
                        installUrl={versionData.install_url ?? ""}
                        installDisabled={!versionData.install_url}
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
