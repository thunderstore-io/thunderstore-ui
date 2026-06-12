import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import {
  faBook,
  faDownload,
  faGamepad,
} from "@fortawesome/free-solid-svg-icons";
import { faArrowUpRight } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Page } from "app/commonComponents/Page/Page";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { getApiHostForSsr } from "cyberstorm/utils/env";
import { createSeo } from "cyberstorm/utils/meta";
import { ssrLoader } from "cyberstorm/utils/ssrLoader";
import { Suspense } from "react";
import type { ShouldRevalidateFunctionArgs } from "react-router";
import {
  Await,
  Outlet,
  useLoaderData,
  useLocation,
  useOutletContext,
} from "react-router";

import {
  Heading,
  Image,
  NewButton,
  NewIcon,
  NewLink,
  SkeletonBox,
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

export const loader = ssrLoader(
  async ({ params, request }: Route.LoaderArgs) => {
    if (params.communityId) {
      const dapper = new DapperTs(() => {
        return {
          apiHost: getApiHostForSsr(),
          sessionId: undefined,
        };
      });
      const community = await dapper.getCommunity(params.communityId);
      const url = new URL(request.url);
      return {
        community: community,
        seo: createSeo({
          descriptors: [
            { title: `The ${community.name} Mod Database` },
            { name: "description", content: `Mods for ${community.name}` },
            { property: "og:image", content: community.cover_image_url ?? "" },
            {
              property: "og:url",
              content: `${url.origin}${url.pathname}`,
            },
            {
              property: "og:description",
              content: `Thunderstore is a mod database and API for downloading ${community.name} mods`,
            },
            { property: "og:image:width", content: "360" },
            { property: "og:image:height", content: "480" },
          ],
        }),
      };
    }
    throw new Response("Community not found", { status: 404 });
  },
  { cache: true }
);

export { forwardLoaderHeaders as headers } from "cyberstorm/utils/ssrLoader";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
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
    };
  }
  throw new Response("Community not found", { status: 404 });
}

export function shouldRevalidate(arg: ShouldRevalidateFunctionArgs) {
  if (
    arg.currentUrl.pathname.split("/")[1] === arg.nextUrl.pathname.split("/")[1]
  ) {
    return false;
  }
  return arg.defaultShouldRevalidate;
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
          csSize="big"
          csVariant="secondary"
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

function CommunityMainHeaderSkeleton() {
  return (
    <div className="community__header">
      <SkeletonBox />
    </div>
  );
}

function CommunityMainPage({
  community,
  outletContext,
}: {
  community: CommunityLoaderData["community"];
  outletContext: OutletContextShape;
}) {
  return (
    <Page rootClasses="community">
      <Suspense fallback={<CommunityMainHeaderSkeleton />}>
        <Await resolve={community}>
          {(resolvedCommunity) => (
            <CommunityMainHeader resolvedCommunity={resolvedCommunity} />
          )}
        </Await>
      </Suspense>
      <Outlet context={outletContext} />
    </Page>
  );
}

export default function Community() {
  const { community } = useLoaderData<typeof loader | typeof clientLoader>();
  const location = useLocation();
  const outletContext = useOutletContext() as OutletContextShape;

  if (isPackageListingPath(location.pathname)) {
    return (
      <CommunityPackageListingPage
        community={community}
        outletContext={outletContext}
      />
    );
  }

  return (
    <CommunityMainPage community={community} outletContext={outletContext} />
  );
}
