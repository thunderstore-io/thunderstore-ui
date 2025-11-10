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
import {
  Heading,
  NewButton,
  NewIcon,
  NewLink,
  SkeletonBox,
} from "@thunderstore/cyberstorm";
import "./Community.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faDownload } from "@fortawesome/free-solid-svg-icons";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faArrowUpRight } from "@fortawesome/pro-solid-svg-icons";
import { DapperTs } from "@thunderstore/dapper-ts";
import { getPublicEnvVariables } from "cyberstorm/security/publicEnvVariables";
import { Suspense } from "react";
import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";
import { throwUserFacingPayloadResponse } from "cyberstorm/utils/errors/userFacingErrorResponse";
import { handleLoaderError } from "cyberstorm/utils/errors/handleLoaderError";
import { createNotFoundMapping } from "cyberstorm/utils/errors/loaderMappings";
import {
  NimbusErrorBoundary,
  NimbusAwaitErrorElement,
  NimbusDefaultRouteErrorBoundary,
} from "cyberstorm/utils/errors/NimbusErrorBoundary";
import type { OutletContextShape } from "~/root";
import { getLoaderTools } from "cyberstorm/utils/getLoaderTools";

/**
 * Remix server loader that fetches the community by id while translating API errors
 * into user-facing payload responses.
 */
export async function loader({ params }: LoaderFunctionArgs) {
  if (params.communityId) {
    const { dapper } = getLoaderTools();
    try {
      const community = await dapper.getCommunity(params.communityId);
      return {
        community,
      };
    } catch (error) {
      handleLoaderError(error, {
        mappings: [
          createNotFoundMapping(
            "Community not found.",
            "We could not find the requested community."
          ),
        ],
      });
    }
  }
  throwUserFacingPayloadResponse({
    headline: "Community not found.",
    description: "We could not find the requested community.",
    category: "not_found",
    status: 404,
  });
}

/**
 * Remix client loader that defers community fetching to the browser and maps
 * API failures to the same user-facing responses as the server loader.
 */
export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.communityId) {
    const { dapper } = getLoaderTools();

    return {
      community: dapper.getCommunity(params.communityId),
    };
  }
  throwUserFacingPayloadResponse({
    headline: "Community not found.",
    description: "We could not find the requested community.",
    category: "not_found",
    status: 404,
  });
}

/**
 * Determines whether the route should revalidate when navigating within the
 * community section.
 */
export function shouldRevalidate(arg: ShouldRevalidateFunctionArgs) {
  if (
    arg.currentUrl.pathname.split("/")[1] === arg.nextUrl.pathname.split("/")[1]
  ) {
    return false;
  }
  return arg.defaultShouldRevalidate;
}

/**
 * Default community route component that renders the header for the selected
 * community and provides Suspense-driven loading states.
 */
export default function Community() {
  const { community } = useLoaderData<typeof loader | typeof clientLoader>();
  const location = useLocation();
  const splitPath = location.pathname.split("/");
  const isSubPath = splitPath.length > 4;
  const isPackageListingSubPath =
    splitPath.length > 5 && splitPath[1] === "c" && splitPath[3] === "p";
  const outletContext = useOutletContext() as OutletContextShape;
  const { VITE_BETA_SITE_URL } = getPublicEnvVariables(["VITE_BETA_SITE_URL"]);

  return (
    <>
      {isSubPath ? null : (
        <Suspense fallback={null}>
          <Await resolve={community} errorElement={<NimbusAwaitErrorElement />}>
            {(result) => {
              return (
                <>
                  <meta
                    title={`Thunderstore - The ${result.name} Mod Database`}
                  />
                  <meta
                    name="description"
                    content={`Mods for ${result.name}`}
                  />
                  <meta property="og:type" content="website" />
                  <meta
                    property="og:url"
                    content={`${VITE_BETA_SITE_URL ?? ""}${location.pathname}`}
                  />
                  <meta
                    property="og:title"
                    content={`Thunderstore - The ${result.name} Mod Database`}
                  />
                  <meta
                    property="og:description"
                    content={`Thunderstore is a mod database and API for downloading ${result.name} mods`}
                  />
                  <meta property="og:image:width" content="360" />
                  <meta property="og:image:height" content="480" />
                  <meta
                    property="og:image"
                    content={result.cover_image_url ?? undefined}
                  />
                  <meta property="og:site_name" content="Thunderstore" />
                </>
              );
            }}
          </Await>
        </Suspense>
      )}

      <Suspense fallback={<CommunitySkeleton />}>
        <Await resolve={community} errorElement={<NimbusAwaitErrorElement />}>
          {(result) => (
            <NimbusErrorBoundary
              title="Error loading community"
              description="Please try reloading the community page."
              retryLabel="Retry page"
              onRetry={({ reset }) => reset()}
            >
              <CommunityHeaderContent
                community={result}
                isPackageListingSubPath={isPackageListingSubPath}
                isSubPath={isSubPath}
              />
            </NimbusErrorBoundary>
          )}
        </Await>
      </Suspense>

      <Outlet context={outletContext} />
    </>
  );
}

/**
 * Renders the community header once the community payload has resolved.
 */
function CommunityHeaderContent(props: {
  community: Awaited<ReturnType<DapperTs["getCommunity"]>>;
  isPackageListingSubPath: boolean;
  isSubPath: boolean;
}) {
  const { community, isPackageListingSubPath, isSubPath } = props;

  return (
    <div className="community__header">
      <div
        className={classnames(
          "community__background",
          isPackageListingSubPath ? "community__background--packagePage" : null
        )}
      >
        {community.hero_image_url ? (
          <img src={community.hero_image_url} alt={community.name} />
        ) : null}
      </div>

      <div
        className={classnames(
          "community__content-header-wrapper",
          isSubPath ? "community__content-header--hide" : null
        )}
      >
        <div className="community__content-header">
          <div className="community__game-icon">
            <div className="community__game-icon-tinified">
              {community.community_icon_url ? (
                <img src={community.community_icon_url} alt={community.name} />
              ) : null}
            </div>
          </div>
          <div className="community__content-header-content">
            <div className="community__header-info">
              <Heading
                csLevel={"1"}
                csSize={"3"}
                csVariant="primary"
                mode="display"
              >
                {community.name}
              </Heading>
            </div>
            <div className="community__header-meta">
              {community.wiki_url ? (
                <NewLink
                  primitiveType="link"
                  href={community.wiki_url}
                  csVariant="cyber"
                  rootClasses="community__item"
                >
                  <NewIcon csMode="inline" noWrapper>
                    <FontAwesomeIcon icon={faBook} />
                  </NewIcon>
                  <span>Modding Wiki</span>
                  <NewIcon csMode="inline" noWrapper>
                    <FontAwesomeIcon icon={faArrowUpRight} />
                  </NewIcon>
                </NewLink>
              ) : null}
              {community.discord_url ? (
                <NewLink
                  primitiveType="link"
                  href={community.discord_url}
                  csVariant="cyber"
                  rootClasses="community__item"
                >
                  <NewIcon csMode="inline" noWrapper>
                    <FontAwesomeIcon icon={faDiscord} />
                  </NewIcon>
                  <span>Modding Discord</span>
                  <NewIcon csMode="inline" noWrapper>
                    <FontAwesomeIcon icon={faArrowUpRight} />
                  </NewIcon>
                </NewLink>
              ) : null}
            </div>
          </div>
        </div>
        <NewButton
          csSize="big"
          csVariant="accent"
          primitiveType="cyberstormLink"
          linkId="PackageUpload"
          rootClasses="community__upload-button"
        >
          <NewIcon noWrapper csMode="inline">
            <FontAwesomeIcon icon={faDownload} />
          </NewIcon>
          Upload package
        </NewButton>
      </div>
    </div>
  );
}

/**
 * Skeleton fallback displayed while community data is loading.
 */
function CommunitySkeleton() {
  return (
    <div className="community__header">
      <SkeletonBox className="community__background" />
      <div className="community__content-header-wrapper">
        <div className="community__content-header">
          <div className="community__game-icon">
            <SkeletonBox className="community__game-icon-tinified" />
          </div>
          <div className="community__content-header-content">
            <div className="community__header-info">
              <div style={{ height: 48, width: 280 }}>
                <SkeletonBox className="community__header-info-skeleton" />
              </div>
            </div>
            <div className="community__header-meta" style={{ gap: "12px" }}>
              <div style={{ height: 40, width: 180 }}>
                <SkeletonBox className="community__header-meta-skeleton" />
              </div>
              <div style={{ height: 40, width: 200 }}>
                <SkeletonBox className="community__header-meta-skeleton" />
              </div>
            </div>
          </div>
        </div>
        <div style={{ height: 56, width: 240 }}>
          <SkeletonBox className="community__upload-button" />
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return <NimbusDefaultRouteErrorBoundary />;
}
