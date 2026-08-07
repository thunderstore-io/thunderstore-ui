import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowRight,
  faBoltLightning,
  faBook,
  faCode,
  faDownload,
  faFire,
} from "@fortawesome/free-solid-svg-icons";
import { faSparkles } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import {
  getCachedCommunityList,
  seedCommunityListCache,
} from "cyberstorm/utils/communityListCache";
import { getApiHostForSsr, getCanonicalUrl } from "cyberstorm/utils/env";
import { createSeo } from "cyberstorm/utils/meta";
import { ssrLoader } from "cyberstorm/utils/ssrLoader";
import { Suspense, memo, useEffect } from "react";
import { Await, useLoaderData, useOutletContext } from "react-router";
import { FetchErrorState } from "~/commonComponents/FetchErrorState/FetchErrorState";
import { Page } from "~/commonComponents/Page/Page";

import {
  CardCommunity,
  Heading,
  NewButton,
  NewIcon,
  NewLink,
  SkeletonBox,
  ThunderstoreLogo,
} from "@thunderstore/cyberstorm";
import { DapperTs } from "@thunderstore/dapper-ts";
import type { Communities } from "@thunderstore/dapper/types";
import { CommunityListOrderingEnum } from "@thunderstore/thunderstore-api";

import type { OutletContextShape } from "../root";
import type { Route } from "./+types/home";
import "./Home.css";
import { HomeCommunitySearch } from "./HomeCommunitySearch";

export { RouteErrorBoundary as ErrorBoundary } from "app/commonComponents/ErrorBoundary";
export { forwardLoaderHeaders as headers } from "cyberstorm/utils/ssrLoader";

// Hardcoded hero stats. The package count is the unique package total from the
// experimental package index (111,941 on 2026-08-06). The game count is the
// community count reported by the community list API on the same date.
const PACKAGE_COUNT_TEXT = "110,000";
const GAME_COUNT_TEXT = "300+";

// Paired with .home__card-row, which steps the visible column count down
// from 7 on narrower viewports.
const ROW_SIZE = 7;

export const loader = ssrLoader(
  async ({ request }: Route.LoaderArgs) => {
    const dapper = new DapperTs(() => {
      return {
        apiHost: getApiHostForSsr(),
        sessionId: undefined,
      };
    });
    const origin = new URL(getCanonicalUrl(request, "/")).origin;
    const description = `Download mods for your favorite games. Choose from over ${PACKAGE_COUNT_TEXT} mods across ${GAME_COUNT_TEXT} games.`;
    const [popular, newest] = await Promise.all([
      dapper.getCommunities(undefined, CommunityListOrderingEnum.Popular),
      dapper.getCommunities(undefined, CommunityListOrderingEnum.Latest),
    ]);
    return {
      popular,
      newest,
      seo: createSeo({
        descriptors: [
          { title: "Thunderstore | The Mod Database" },
          { name: "description", content: description },
          { property: "og:type", content: "website" },
          { property: "og:url", content: getCanonicalUrl(request, "/") },
          { property: "og:title", content: "Thunderstore | The Mod Database" },
          { property: "og:description", content: description },
          {
            property: "og:image",
            content: getCanonicalUrl(
              request,
              "/cyberstorm-static/images/icon.webp"
            ),
          },
          { property: "og:site_name", content: "Thunderstore" },
          {
            "script:ld+json": {
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  name: "Thunderstore",
                  url: origin,
                  logo: `${origin}/android-chrome-512x512.png`,
                },
                {
                  "@type": "WebSite",
                  name: "Thunderstore",
                  url: origin,
                  potentialAction: {
                    "@type": "SearchAction",
                    target: {
                      "@type": "EntryPoint",
                      urlTemplate: `${origin}/communities?search={search_term_string}`,
                    },
                    "query-input": "required name=search_term_string",
                  },
                },
              ],
            },
          },
        ],
      }),
    };
  },
  { cache: true }
);

export async function clientLoader() {
  const tools = getSessionTools();
  const dapper = new DapperTs(() => {
    return {
      apiHost: tools?.getConfig().apiHost,
      sessionId: tools?.getConfig().sessionId,
    };
  });
  return {
    popular: getCachedCommunityList(dapper, CommunityListOrderingEnum.Popular),
    newest: getCachedCommunityList(dapper, CommunityListOrderingEnum.Latest),
  };
}

export default function HomePage() {
  const { popular, newest } = useLoaderData<
    typeof loader | typeof clientLoader
  >();
  const outletContext = useOutletContext() as OutletContextShape;
  const domain = outletContext.domain;

  // Prime the client cache with the SSR-fetched lists so the first
  // navigation to /communities doesn't refetch.
  useEffect(() => {
    seedCommunityListCache(popular, CommunityListOrderingEnum.Popular);
    seedCommunityListCache(newest, CommunityListOrderingEnum.Latest);
  }, [popular, newest]);

  const resources = [
    {
      title: "Modding Wiki",
      description:
        "Got questions about modding or using Thunderstore? We got answers.",
      href: "https://wiki.thunderstore.io/",
      icon: faBook,
      variant: "wiki",
    },
    {
      title: "API Documentation",
      description: "Building something nifty? Get the data flowing.",
      href: `${domain}/api/docs/`,
      icon: faCode,
      variant: "api",
    },
    {
      title: "GitHub Repo",
      description: "Want to contribute or just pop the hood open? Have a look.",
      href: "https://github.com/thunderstore-io",
      icon: faGithub,
      variant: "github",
    },
    {
      title: "Get in touch",
      description: "Join in our Discord and become part of the community.",
      href: "https://discord.thunderstore.io/",
      icon: faDiscord,
      variant: "discord",
    },
  ];

  return (
    <Page as="section" rootClasses="home">
      <div className="home__hero">
        <div className="home__hero-text">
          <Heading
            csLevel="1"
            mode="display"
            csSize="2"
            rootClasses="home__hero-heading"
          >
            What are <span className="home__hero-you">you</span> playing today?
          </Heading>
          <p className="home__hero-tagline">
            Choose from over{" "}
            <span className="home__hero-stat">{PACKAGE_COUNT_TEXT}</span> mods
            across <span className="home__hero-stat">{GAME_COUNT_TEXT}</span>{" "}
            games
          </p>
        </div>
        <HomeCommunitySearch communities={popular} />
      </div>
      <section className="home__section" aria-label="Top communities">
        <div className="home__section-header">
          <NewIcon csMode="inline" noWrapper rootClasses="home__section-icon">
            <FontAwesomeIcon icon={faFire} />
          </NewIcon>
          <Heading csLevel="2" csSize="2" rootClasses="home__section-heading">
            Top Communities
          </Heading>
          <NewLink
            primitiveType="cyberstormLink"
            linkId="Communities"
            rootClasses="home__see-all"
          >
            See all
          </NewLink>
        </div>
        <Suspense fallback={<CommunityRowSkeleton />}>
          <Await
            resolve={popular}
            errorElement={
              <FetchErrorState message="Couldn't load communities." />
            }
          >
            {(resolvedValue) => (
              <CommunityRow communitiesData={resolvedValue} />
            )}
          </Await>
        </Suspense>
      </section>
      <section className="home__section" aria-label="New communities">
        <div className="home__section-header">
          <NewIcon csMode="inline" noWrapper rootClasses="home__section-icon">
            <FontAwesomeIcon icon={faSparkles} />
          </NewIcon>
          <Heading csLevel="2" csSize="2" rootClasses="home__section-heading">
            New Communities
          </Heading>
          <NewLink
            primitiveType="cyberstormLink"
            linkId="Communities"
            queryParams={`order=${CommunityListOrderingEnum.Latest}`}
            rootClasses="home__see-all"
          >
            See all
          </NewLink>
        </div>
        <Suspense fallback={<CommunityRowSkeleton />}>
          <Await
            resolve={newest}
            errorElement={
              <FetchErrorState message="Couldn't load communities." />
            }
          >
            {(resolvedValue) => (
              <CommunityRow communitiesData={resolvedValue} />
            )}
          </Await>
        </Suspense>
      </section>
      <section className="home__manager" aria-label="Thunderstore Mod Manager">
        <div className="home__manager-watermark" aria-hidden="true">
          <ThunderstoreLogo />
        </div>
        <div className="home__manager-body">
          <Heading
            csLevel="2"
            mode="display"
            csSize="2"
            rootClasses="home__manager-heading"
          >
            Managing Mods
            <span className="home__manager-heading-gradient">
              Just Got Better
            </span>
          </Heading>
          <p className="home__manager-desc">
            Download Thunderstore Mod Manager for Windows to easily install,
            update, and manage your mods.{" "}
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faBoltLightning} />
            </NewIcon>
          </p>
          <NewButton
            primitiveType="link"
            href="https://get.thunderstore.io/"
            csSize="big"
            csVariant="accent"
          >
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faDownload} />
            </NewIcon>
            Get Manager
          </NewButton>
        </div>
        <div className="home__manager-media">
          <img
            alt="Screenshot of the Thunderstore Mod Manager"
            width="1350"
            height="811"
            src="/cyberstorm-static/images/tsmm_screenshot.png"
          />
        </div>
      </section>
      <nav className="home__resources" aria-label="Developer resources">
        {resources.map((resource) => (
          <NewLink
            key={resource.title}
            primitiveType="link"
            href={resource.href}
            rootClasses="home__resource-card"
          >
            <span
              className={`home__resource-icon home__resource-icon--${resource.variant}`}
            >
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={resource.icon} />
              </NewIcon>
            </span>
            <span className="home__resource-body">
              <span className="home__resource-title">{resource.title}</span>
              <span className="home__resource-description">
                {resource.description}
              </span>
            </span>
            <NewIcon
              csMode="inline"
              noWrapper
              rootClasses="home__resource-arrow"
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </NewIcon>
          </NewLink>
        ))}
      </nav>
    </Page>
  );
}

const CommunityRow = memo(function CommunityRow(props: {
  communitiesData: Communities;
}) {
  const { communitiesData } = props;
  return (
    <div className="home__card-row">
      {communitiesData.results.slice(0, ROW_SIZE).map((community) => (
        <CardCommunity key={community.identifier} community={community} />
      ))}
    </div>
  );
});

const CommunityRowSkeleton = memo(function CommunityRowSkeleton() {
  return (
    <div className="home__card-row">
      {Array.from({ length: ROW_SIZE }).map((_, index) => (
        <div key={index} className="home__card-skeleton">
          <div className="home__card-skeleton-image">
            <SkeletonBox />
          </div>
          <div className="home__card-skeleton-title">
            <SkeletonBox />
          </div>
          <div className="home__card-skeleton-meta">
            <SkeletonBox />
          </div>
        </div>
      ))}
    </div>
  );
});
