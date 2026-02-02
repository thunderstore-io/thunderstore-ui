import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faBook, faDownload } from "@fortawesome/free-solid-svg-icons";
import { faArrowUpRight } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { getApiHostForSsr } from "cyberstorm/utils/env";
import { Suspense } from "react";
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
  classnames,
} from "@thunderstore/cyberstorm";
import { DapperTs } from "@thunderstore/dapper-ts";

import { type OutletContextShape } from "../root";
import "./Community.css";

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.communityId) {
    const dapper = new DapperTs(() => {
      return {
        apiHost: getApiHostForSsr(),
        sessionId: undefined,
      };
    });
    const community = await dapper.getCommunity(params.communityId);
    return {
      community: community,
    };
  }
  throw new Response("Community not found", { status: 404 });
}

export async function clientLoader({ params }: LoaderFunctionArgs) {
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
      {isSubPath ? null : (
        <Suspense>
          <Await resolve={community}>
            {(resolvedValue) => (
              <>
                <meta
                  title={`Thunderstore - The ${resolvedValue.name} Mod Database`}
                />
                <meta
                  name="description"
                  content={`Mods for ${resolvedValue.name}`}
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
                  content={`Thunderstore - The ${resolvedValue.name} Mod Database`}
                />
                <meta
                  property="og:description"
                  content={`Thunderstore is a mod database and API for downloading ${resolvedValue.name} mods`}
                />
                <meta property="og:image:width" content="360" />
                <meta property="og:image:height" content="480" />
                <meta
                  property="og:image"
                  content={resolvedValue.cover_image_url ?? undefined}
                />
                <meta property="og:site_name" content="Thunderstore" />
              </>
            )}
          </Await>
        </Suspense>
      )}

      <>
        <div className="community__header">
          <div
            className={classnames(
              "community__background",
              isPackageListingSubPath
                ? "community__background--packagePage"
                : null
            )}
          >
            <Suspense fallback={<SkeletonBox />}>
              <Await resolve={community}>
                {(resolvedValue) =>
                  resolvedValue.hero_image_url ? (
                    <img
                      src={resolvedValue.hero_image_url}
                      alt={resolvedValue.name}
                    />
                  ) : null
                }
              </Await>
            </Suspense>
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
                  <Suspense fallback={<SkeletonBox />}>
                    <Await resolve={community}>
                      {(resolvedValue) =>
                        resolvedValue.community_icon_url ? (
                          <img
                            src={resolvedValue.community_icon_url}
                            alt={resolvedValue.name}
                          />
                        ) : null
                      }
                    </Await>
                  </Suspense>
                </div>
              </div>
              <div className="community__content-header-content">
                <div className="community__header-info">
                  <Suspense fallback={<SkeletonBox />}>
                    <Await resolve={community}>
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
                    </Await>
                  </Suspense>
                </div>
                <div className="community__header-meta">
                  <Suspense fallback={<SkeletonBox />}>
                    <Await resolve={community}>
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
                    </Await>
                  </Suspense>
                  <Suspense fallback={<SkeletonBox />}>
                    <Await resolve={community}>
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
                    </Await>
                  </Suspense>
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
        <Outlet context={outletContext} />
      </>
    </>
  );
}
