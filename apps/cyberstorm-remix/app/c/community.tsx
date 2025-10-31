import type {
  LoaderFunctionArgs,
  ShouldRevalidateFunctionArgs,
} from "react-router";
import {
  Await,
  Outlet,
  useAsyncError,
  useLoaderData,
  useLocation,
  useOutletContext,
  useRouteError,
} from "react-router";
import {
  Heading,
  // NewAlert,
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
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { Suspense } from "react";
import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";
import { throwUserFacingPayloadResponse } from "cyberstorm/utils/errors/userFacingErrorResponse";
import { handleLoaderError } from "cyberstorm/utils/errors/handleLoaderError";
import {
  FORBIDDEN_MAPPING,
  RATE_LIMIT_MAPPING,
  SIGN_IN_REQUIRED_MAPPING,
  createNotFoundMapping,
  createServerErrorMapping,
} from "cyberstorm/utils/errors/loaderMappings";
import {
  NimbusErrorBoundary,
  NimbusErrorBoundaryFallback,
} from "~/commonComponents/NimbusErrorBoundary";
import type { NimbusErrorBoundaryFallbackProps } from "~/commonComponents/NimbusErrorBoundary";
import type { OutletContextShape } from "~/root";

const communityErrorMappings = [
  SIGN_IN_REQUIRED_MAPPING,
  FORBIDDEN_MAPPING,
  createNotFoundMapping(
    "Community not found.",
    "We could not find the requested community."
  ),
  RATE_LIMIT_MAPPING,
  createServerErrorMapping(),
];

/**
 * Remix server loader that fetches the community by id while translating API errors
 * into user-facing payload responses.
 */
export async function loader({ params }: LoaderFunctionArgs) {
  if (params.communityId) {
    const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
    const dapper = new DapperTs(() => {
      return {
        apiHost: publicEnvVariables.VITE_API_URL,
        sessionId: undefined,
      };
    });
    try {
      const community = await dapper.getCommunity(params.communityId);
      return {
        community,
      };
    } catch (error) {
      handleLoaderError(error, { mappings: communityErrorMappings });
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
  const { communityId } = params;

  if (communityId) {
    const tools = getSessionTools();
    const dapper = new DapperTs(() => {
      return {
        apiHost: tools?.getConfig().apiHost,
        sessionId: tools?.getConfig().sessionId,
      };
    });

    const wrapperPromise =
      Promise.withResolvers<Awaited<ReturnType<DapperTs["getCommunity"]>>>();

    dapper
      .getCommunity(communityId)
      .then(wrapperPromise.resolve)
      .catch((error) => {
        try {
          handleLoaderError(error, { mappings: communityErrorMappings });
        } catch (handledError) {
          wrapperPromise.reject(handledError);
          return;
        }

        wrapperPromise.reject(error);
      });

    return {
      community: wrapperPromise.promise,
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

type CommunityDetails = Awaited<ReturnType<DapperTs["getCommunity"]>>;

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

  return (
    <>
      {/* {isSubPath ? null : (
        <Suspense fallback={null}>
          <Await resolve={community} errorElement={<CommunityErrorHandler />}>
            {(result) => {
              if (isCommunityError(result)) {
                return null;
              }

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
                    content={`${getPublicEnvVariables(["VITE_BETA_SITE_URL"])}${
                      location.pathname
                    }`}
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
      )} */}

      <Suspense fallback={<CommunitySkeleton />}>
        <Await resolve={community} errorElement={<CommunityErrorHandler />}>
          {(result) => (
            <NimbusErrorBoundary
              fallback={CommunityHeaderErrorFallback}
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
  community: CommunityDetails;
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

/**
 * Nimbus fallback wrapper that enforces community-specific styling.
 */
function CommunityHeaderErrorFallback(props: NimbusErrorBoundaryFallbackProps) {
  const { className, retryLabel, ...rest } = props;
  const mergedClassName = className
    ? `${className} community__error`
    : "community__error";

  return (
    <NimbusErrorBoundaryFallback
      {...rest}
      className={mergedClassName}
      retryLabel={retryLabel ?? "Retry"}
    />
  );
}

/**
 * Handles errors thrown while awaiting the community promise and surfaces the
 * retry affordance that triggers a full page navigation.
 */
function CommunityErrorHandler() {
  const error = useAsyncError();

  return (
    <CommunityHeaderErrorFallback
      error={error}
      title="Error loading community"
      retryLabel="Retry page"
    />
  );
}

/**
 * Error boundary for synchronous route-level failures.
 */
export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <CommunityHeaderErrorFallback
      error={error}
      title="Error loading community"
      retryLabel="Retry page"
    />
  );
}
