import {
  type ReactElement,
  Suspense,
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
  type LoaderFunctionArgs,
} from "react-router";
import { useHydrated } from "remix-utils/use-hydrated";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useReportPackage } from "app/p/components/ReportPackage/useReportPackage";
import { type OutletContextShape } from "app/root";
import { isPromise } from "cyberstorm/utils/typeChecks";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";

import { NewIcon, RelativeTime, useToast } from "@thunderstore/cyberstorm";
import { PackageLikeAction } from "@thunderstore/cyberstorm-forms";
import { DapperTs } from "@thunderstore/dapper-ts";
import {
  getPublicListing,
  getPrivateListing,
  getPackageListingStatus,
  getUserPermissions,
} from "./listingUtils";
import { getDapperForRequest } from "cyberstorm/utils/dapperSingleton";
import { ManagementTools } from "./components/PackageListing/ManagementTools";
import {
  InternalNotes,
  RejectionReason,
} from "./components/PackageListing/ReviewInformation";
import { PackageMetaTags } from "./components/PackageListing/PackageMetaTags";
import { PackageHeader } from "./components/PackageListing/PackageHeader";
import { PackageDrawer } from "./components/PackageListing/PackageDrawer";
import { PackageActions } from "./components/PackageListing/PackageActions";
import { PackageTabs } from "./components/PackageListing/PackageTabs";
import { PackageSidebar } from "./components/PackageListing/PackageSidebar";

import "./packageListing.css";

type PackageListingOutletContext = OutletContextShape & {
  packageDownloadUrl?: string;
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { communityId, namespaceId, packageId } = params;

  if (!communityId || !namespaceId || !packageId) {
    throw new Response("Package not found", { status: 404 });
  }

  const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
  const dapper = new DapperTs(() => ({
    apiHost: publicEnvVariables.VITE_API_URL,
    sessionId: undefined,
  }));

  const listing = await getPublicListing(dapper, {
    communityId,
    namespaceId,
    packageId,
  });

  return {
    community: await dapper.getCommunity(communityId),
    communityFilters: await dapper.getCommunityFilters(communityId),
    listing: listing,
    listingStatus: undefined,
    team: await dapper.getTeamDetails(namespaceId),
    permissions: undefined,
    community_identifier: communityId,
    namespace_id: namespaceId,
    package_id: packageId,
  };
}

export async function clientLoader({ params, request }: LoaderFunctionArgs) {
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

  return {
    community: dapper.getCommunity(communityId),
    communityFilters: dapper.getCommunityFilters(communityId),
    listing: listing,
    listingStatus: getPackageListingStatus(
      tools,
      dapper,
      communityId,
      namespaceId,
      packageId
    ),
    team: dapper.getTeamDetails(namespaceId),
    permissions: getUserPermissions(
      tools,
      dapper,
      communityId,
      namespaceId,
      packageId
    ),
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
  const domain = outletContext.domain;
  const dapper = outletContext.dapper;

  const [isLiked, setIsLiked] = useState(false);
  const toast = useToast();

  const { ReportPackageButton, ReportPackageModal } = useReportPackage({
    formPropsPromise: Promise.resolve({
      community: community_identifier,
      namespace: namespace_id,
      package: package_id,
    }),
    config: config,
  });

  // TODO: This needs to be fixes - listing is not a promise here
  // TODO: no need to get namespace and name from listing if we have them in params
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
    if (!listing || (!startsHydrated.current && isHydrated)) {
      return;
    }

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

  const packageLikeAction = PackageLikeAction({
    isLoggedIn: Boolean(currentUser?.username),
    dataUpdateTrigger: fetchAndSetRatedPackages,
    config: config,
  });

  // TODO: Add proper loading element
  if (!listing) {
    return <div>Loading package...</div>;
  }

  // TODO: some variables are available in props (communityId, namespaceId, packageId)
  return (
    <>
      <Suspense>
        <Await resolve={community}>
          {(resolvedCommunity) => (
            <>
              <PackageMetaTags
                packageName={listing.name}
                packageDescription={listing.description}
                communityName={resolvedCommunity.name}
                pathname={location.pathname}
                namespace={listing.namespace}
                iconUrl={listing.icon_url}
              />
            </>
          )}
        </Await>
      </Suspense>

      <div className="container container--y container--full">
        <section className="package-listing__package-section">
          <Suspense>
            <Await resolve={listingStatus}>
              {(resolvedStatus) => (
                <Await resolve={permissions}>
                  {(resolvedPermissions) =>
                    resolvedPermissions ? (
                      <>
                        <ManagementTools
                          listingStatus={resolvedStatus}
                          packagePermissions={resolvedPermissions}
                          listing={listing}
                          toast={toast}
                          requestConfig={config}
                        />
                        <RejectionReason status={resolvedStatus} />
                        <InternalNotes status={resolvedStatus} />
                      </>
                    ) : null
                  }
                </Await>
              )}
            </Await>
          </Suspense>

          <div className="package-listing__main">
            <section className="package-listing__package-content-section">
              <PackageHeader packageListing={listing} />

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

                <PackageDrawer
                  lastUpdated={lastUpdated}
                  firstUploaded={firstUploaded}
                  listing={listing}
                  community={community}
                  domain={domain}
                />

                <Suspense fallback={<p>Loading...</p>}>
                  <Await resolve={team}>
                    {(resolvedTeam) => (
                      <PackageActions
                        team={resolvedTeam}
                        listing={listing}
                        isLiked={isLiked}
                        currentUser={currentUser}
                        packageLikeAction={packageLikeAction}
                      />
                    )}
                  </Await>
                </Suspense>

                {ReportPackageButton}
              </div>

              <>
                <PackageTabs listing={listing} currentTab={currentTab} />
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

            <PackageSidebar
              listing={listing}
              team={team}
              isLiked={isLiked}
              currentUser={currentUser}
              packageLikeAction={packageLikeAction}
              ReportPackageButton={ReportPackageButton}
              lastUpdated={lastUpdated}
              firstUploaded={firstUploaded}
              community={community}
              domain={domain}
            />
          </div>
        </section>
      </div>

      {ReportPackageModal}
    </>
  );
}
