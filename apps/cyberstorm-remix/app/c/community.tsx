import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faBook, faDownload } from "@fortawesome/free-solid-svg-icons";
import { faArrowUpRight } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { getApiHostForSsr } from "cyberstorm/utils/env";
import { createSeo } from "cyberstorm/utils/meta";
import React from "react";
import type { ShouldRevalidateFunctionArgs } from "react-router";
import {
  Outlet,
  useLoaderData,
  useLocation,
  useOutletContext,
} from "react-router";
import { SuspenseIfPromise } from "~/commonComponents/SuspenseIfPromise/SuspenseIfPromise";

import {
  Heading,
  NewButton,
  NewIcon,
  NewLink,
  SkeletonBox,
  classnames,
} from "@thunderstore/cyberstorm";
import { DapperTs } from "@thunderstore/dapper-ts";

import { type OutletContextShape } from "../root";
import type { Route } from "./+types/community";
import "./Community.css";

export async function loader({ params, request }: Route.LoaderArgs) {
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
}

export async function clientLoader({
  params,
  serverLoader,
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
      seo: (await serverLoader()).seo,
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

export default function Community() {
  const { community } = useLoaderData<typeof loader | typeof clientLoader>();
  const location = useLocation();
  const splitPath = location.pathname.split("/");
  const isSubPath = splitPath.length > 4;
  const isPackageListingSubPath =
    splitPath.length > 5 && splitPath[1] === "c" && splitPath[3] === "p";

  const outletContext = useOutletContext() as OutletContextShape;

  const memoizedContext = React.useMemo(
    () => ({ ...outletContext, community }),
    [outletContext, community]
  );

  const headerContent = React.useMemo(
    () => (
      <div className="community__header">
        <div
          className={classnames(
            "community__background",
            isPackageListingSubPath
              ? "community__background--packagePage"
              : null
          )}
        >
          <SuspenseIfPromise fallback={<SkeletonBox />} resolve={community}>
            {(resolvedValue) =>
              resolvedValue.hero_image_url ? (
                <img
                  src={resolvedValue.hero_image_url}
                  alt={resolvedValue.name}
                />
              ) : null
            }
          </SuspenseIfPromise>
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
                <SuspenseIfPromise
                  resolve={community}
                  fallback={<SkeletonBox />}
                >
                  {(resolvedValue) =>
                    resolvedValue.community_icon_url ? (
                      <img
                        src={resolvedValue.community_icon_url}
                        alt={resolvedValue.name}
                      />
                    ) : null
                  }
                </SuspenseIfPromise>
              </div>
            </div>
            <div className="community__content-header-content">
              <div className="community__header-info">
                <SuspenseIfPromise
                  resolve={community}
                  fallback={<SkeletonBox />}
                >
                  {(resolvedValue) => (
                    <Heading
                      csLevel={"1"}
                      csSize={"3"}
                      csVariant="primary"
                      mode="display"
                    >
                      {resolvedValue.name}
                    </Heading>
                  )}
                </SuspenseIfPromise>
              </div>
              <div className="community__header-meta">
                <SuspenseIfPromise
                  resolve={community}
                  fallback={<SkeletonBox />}
                >
                  {(resolvedValue) =>
                    resolvedValue.wiki_url ? (
                      <NewLink
                        primitiveType="link"
                        href={resolvedValue.wiki_url}
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
                    ) : null
                  }
                </SuspenseIfPromise>
                <SuspenseIfPromise
                  resolve={community}
                  fallback={<SkeletonBox />}
                >
                  {(resolvedValue) =>
                    resolvedValue.discord_url ? (
                      <NewLink
                        primitiveType="link"
                        href={resolvedValue.discord_url}
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
                    ) : null
                  }
                </SuspenseIfPromise>
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
    ),
    [community, isPackageListingSubPath, isSubPath]
  );

  return (
    <>
      {headerContent}
      <Outlet context={memoizedContext} />
    </>
  );
}
