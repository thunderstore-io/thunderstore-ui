import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faBook, faGamepad, faUpload } from "@fortawesome/free-solid-svg-icons";
import { faArrowUpRight } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CommunityAlerts } from "app/commonComponents/CommunityAlerts/CommunityAlerts";
import {
  CommunityPromo,
  communityHasPromo,
} from "app/commonComponents/CommunityPromo/CommunityPromo";
import { Page } from "app/commonComponents/Page/Page";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { getApiHostForSsr, getCanonicalUrl } from "cyberstorm/utils/env";
import { type SeoValue, createSeo } from "cyberstorm/utils/meta";
import { isSameCommunity } from "cyberstorm/utils/revalidation";
import { ssrLoader } from "cyberstorm/utils/ssrLoader";
import { isPromise } from "cyberstorm/utils/typeChecks";
import { Suspense } from "react";
import type { ShouldRevalidateFunctionArgs } from "react-router";
import {
  Await,
  Outlet,
  useLoaderData,
  useLocation,
  useOutletContext,
  useParams,
} from "react-router";

import {
  Heading,
  Image,
  NewButton,
  NewIcon,
  NewLink,
  SkeletonBox,
  classnames,
} from "@thunderstore/cyberstorm";
import { DapperTs } from "@thunderstore/dapper-ts";

import { type OutletContextShape } from "../root";
import type { Route } from "./+types/Community";
import "./Community.css";
import {
  CommunityPackageListingPage,
  isPackageListingPath,
} from "./CommunityPackageListingSubpath";

export { RouteErrorBoundary as ErrorBoundary } from "app/commonComponents/ErrorBoundary";

function communityDescription(name: string): string {
  return (
    `Install and share the best ${name} mods on Thunderstore! ` +
    "Easily manage and update your installed mods with Thunderstore Mod Manager."
  );
}

// Just what the descriptors read, so they can be built from a community that
// is still in flight without depending on this route's own loader types.
type CommunitySeoSource = {
  name: string;
  community_icon_url: string | null;
};

// No width/height: the API doesn't report the icon's real size.
function communityOgImage(community: CommunitySeoSource) {
  if (!community.community_icon_url) {
    return [];
  }
  return [
    { property: "og:image", content: community.community_icon_url },
    { property: "og:image:alt", content: `${community.name} icon` },
  ];
}

function communityDescriptors(community: CommunitySeoSource, request: Request) {
  return createSeo({
    descriptors: [
      { title: `${community.name} Mods · Thunderstore` },
      {
        name: "description",
        content: communityDescription(community.name),
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: getCanonicalUrl(request) },
      {
        property: "og:title",
        content: `The ${community.name} Mod Database`,
      },
      {
        property: "og:description",
        content: `Thunderstore is a mod database and API for downloading ${community.name} mods`,
      },
      ...communityOgImage(community),
      { property: "og:site_name", content: "Thunderstore" },
    ],
  });
}

/**
 * Shared by both loaders, and takes the community either resolved or still in
 * flight. The client loader's data replaces the server's, so tags only the SSR
 * loader emitted would vanish on a client-side navigation into a community —
 * the page would fall back to the root title and description. It keeps handing
 * over the promise rather than awaiting it, so the header keeps its pending
 * state and the navigation is not held up for a title; <Seo> renders the tags
 * once the community arrives.
 */
function communitySeo(
  community: CommunitySeoSource | Promise<CommunitySeoSource>,
  request: Request
): SeoValue {
  if (isPromise(community)) {
    // Handled here rather than at the point of use so a failed fetch cannot
    // surface as an unhandled rejection. The route renders its error boundary;
    // the tags just stay as they are.
    return community.then(
      (resolved) => communityDescriptors(resolved, request),
      () => undefined
    );
  }
  return communityDescriptors(community, request);
}

export const loader = ssrLoader(
  async ({ params, request }: Route.LoaderArgs) => {
    if (params.communityId) {
      const dapper = new DapperTs(() => {
        return {
          apiHost: getApiHostForSsr(),
          sessionId: undefined,
        };
      });
      // Independent requests, so don't serialize them: this is the layout
      // route for all of /c/*, and the alerts are awaited to keep the alert in
      // the server HTML (no layout shift).
      const [community, alerts] = await Promise.all([
        dapper.getCommunity(params.communityId),
        dapper.getCommunityAlerts(params.communityId).catch(() => []),
      ]);
      return {
        community: community,
        alerts: alerts,
        seo: communitySeo(community, request),
      };
    }
    throw new Response("Community not found", { status: 404 });
  },
  { cache: true }
);

export { forwardLoaderHeaders as headers } from "cyberstorm/utils/ssrLoader";

export async function clientLoader({
  request,
  params,
}: Route.ClientLoaderArgs) {
  if (params.communityId) {
    const tools = getSessionTools();
    const dapper = new DapperTs(() => {
      return {
        apiHost: tools?.getConfig().apiHost,
        sessionId: tools?.getConfig().sessionId,
      };
    });
    const community = dapper.getCommunity(params.communityId);
    return {
      community: community,
      alerts: dapper.getCommunityAlerts(params.communityId).catch(() => []),
      seo: communitySeo(community, request),
    };
  }
  throw new Response("Community not found", { status: 404 });
}

// A community does not change while navigating inside it, so skip the refetch.
// See isSameCommunity for why the id, and not the path, decides that.
export function shouldRevalidate({
  currentParams,
  nextParams,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  if (isSameCommunity(currentParams, nextParams)) {
    return false;
  }
  return defaultShouldRevalidate;
}

type CommunityLoaderData = ReturnType<
  typeof useLoaderData<typeof loader | typeof clientLoader>
>;

type ResolvedCommunity = Awaited<
  Awaited<ReturnType<typeof loader>>["community"]
>;

function CommunityMainHeroBackground({
  resolvedCommunity,
}: {
  resolvedCommunity: ResolvedCommunity;
}) {
  return (
    <div className="community__background">
      {resolvedCommunity.hero_image_url ? (
        <div className="community__background-image">
          <img
            src={resolvedCommunity.hero_image_url}
            alt={resolvedCommunity.name}
          />
        </div>
      ) : null}
    </div>
  );
}

function CommunityMainHeader({
  resolvedCommunity,
}: {
  resolvedCommunity: ResolvedCommunity;
}) {
  return (
    <div className="community__header">
      <CommunityMainHeroBackground resolvedCommunity={resolvedCommunity} />
      <div className="community__content-header-wrapper">
        <div className="community__content-header">
          <div className="community__game-icon">
            <div className="community__game-icon-tinified">
              <Image
                src={resolvedCommunity.community_icon_url}
                fallbackIcon={faGamepad}
                square
                alt={resolvedCommunity.name}
                intrinsicWidth={88}
                intrinsicHeight={88}
                rootClasses="community__game-icon-image"
              />
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
                {resolvedCommunity.name}
              </Heading>
            </div>
            <div className="community__header-meta">
              {resolvedCommunity.wiki_url ? (
                <NewLink
                  primitiveType="link"
                  href={resolvedCommunity.wiki_url}
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
              {resolvedCommunity.discord_url ? (
                <NewLink
                  primitiveType="link"
                  href={resolvedCommunity.discord_url}
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
          csVariant="secondary"
          primitiveType="cyberstormLink"
          linkId="PackageUpload"
          rootClasses="community__upload-button"
        >
          <NewIcon noWrapper csMode="inline">
            <FontAwesomeIcon icon={faUpload} />
          </NewIcon>
          Upload package
        </NewButton>
      </div>
    </div>
  );
}

function CommunityMainHeaderSkeleton() {
  return (
    <div className="community__header">
      <SkeletonBox />
    </div>
  );
}

function CommunityMainPage({
  community,
  alerts,
  outletContext,
}: {
  community: CommunityLoaderData["community"];
  alerts: CommunityLoaderData["alerts"];
  outletContext: OutletContextShape;
}) {
  const communityId = useParams().communityId;
  const showCommunityPromo = communityHasPromo(communityId);

  return (
    <Page
      rootClasses={classnames(
        "community",
        showCommunityPromo ? "community--with-promo" : null
      )}
    >
      <Suspense fallback={<CommunityMainHeaderSkeleton />}>
        <Await resolve={community}>
          {(resolvedCommunity) => (
            <CommunityMainHeader resolvedCommunity={resolvedCommunity} />
          )}
        </Await>
      </Suspense>
      <CommunityAlerts alerts={alerts} />
      {showCommunityPromo ? (
        <CommunityPromo variant="bar" communityId={communityId} />
      ) : null}
      <Outlet context={outletContext} />
    </Page>
  );
}

export default function Community() {
  const { community, alerts } = useLoaderData<
    typeof loader | typeof clientLoader
  >();
  const location = useLocation();
  const outletContext = useOutletContext() as OutletContextShape;

  if (isPackageListingPath(location.pathname)) {
    return <CommunityPackageListingPage outletContext={outletContext} />;
  }

  return (
    <CommunityMainPage
      community={community}
      alerts={alerts}
      outletContext={outletContext}
    />
  );
}
