import type { LoaderFunctionArgs } from "react-router";
import { Await, useLoaderData, useOutletContext } from "react-router";
import {
  NewBreadCrumbs,
  NewBreadCrumbsLink,
  NewIcon,
  NewLink,
} from "@thunderstore/cyberstorm";
import "./Community.css";
import { PackageSearch } from "~/commonComponents/PackageSearch/PackageSearch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { PackageOrderOptions } from "~/commonComponents/PackageSearch/components/PackageOrder";
import { faArrowUpRight } from "@fortawesome/pro-solid-svg-icons";
import { DapperTs } from "@thunderstore/dapper-ts";
import { OutletContextShape } from "../root";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { Suspense, useMemo } from "react";

export async function loader({ request, params }: LoaderFunctionArgs) {
  if (params.communityId) {
    const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
    const dapper = new DapperTs(() => {
      return {
        apiHost: publicEnvVariables.VITE_API_URL,
        sessionId: undefined,
      };
    });
    const searchParams = new URL(request.url).searchParams;
    const ordering =
      searchParams.get("ordering") ?? PackageOrderOptions.Updated;
    const page = searchParams.get("page");
    const search = searchParams.get("search");
    const includedCategories = searchParams.get("includedCategories");
    const excludedCategories = searchParams.get("excludedCategories");
    const section = searchParams.get("section");
    const nsfw = searchParams.get("nsfw");
    const deprecated = searchParams.get("deprecated");
    const community = dapper.getCommunity(params.communityId);
    const filters = dapper.getCommunityFilters(params.communityId);

    return {
      community: community,
      filters: filters,
      listings: dapper.getPackageListings(
        {
          kind: "community",
          communityId: params.communityId,
        },
        ordering ?? "",
        page === null ? undefined : Number(page),
        search ?? "",
        includedCategories?.split(",") ?? undefined,
        excludedCategories?.split(",") ?? undefined,
        section ? (section === "all" ? "" : section) : "",
        nsfw === "true" ? true : false,
        deprecated === "true" ? true : false
      ),
    };
  }
  throw new Response("Community not found", { status: 404 });
}

export async function clientLoader({ request, params }: LoaderFunctionArgs) {
  if (params.communityId) {
    const tools = getSessionTools();
    const dapper = new DapperTs(() => {
      return {
        apiHost: tools?.getConfig().apiHost,
        sessionId: tools?.getConfig().sessionId,
      };
    });
    const searchParams = new URL(request.url).searchParams;
    const ordering =
      searchParams.get("ordering") ?? PackageOrderOptions.Updated;
    const page = searchParams.get("page");
    const search = searchParams.get("search");
    const includedCategories = searchParams.get("includedCategories");
    const excludedCategories = searchParams.get("excludedCategories");
    const section = searchParams.get("section");
    const nsfw = searchParams.get("nsfw");
    const deprecated = searchParams.get("deprecated");
    const community = dapper.getCommunity(params.communityId);
    const filters = dapper.getCommunityFilters(params.communityId);
    return {
      community: community,
      filters: filters,
      listings: dapper.getPackageListings(
        {
          kind: "community",
          communityId: params.communityId,
        },
        ordering ?? "",
        page === null ? undefined : Number(page),
        search ?? "",
        includedCategories?.split(",") ?? undefined,
        excludedCategories?.split(",") ?? undefined,
        section ? (section === "all" ? "" : section) : "",
        nsfw === "true" ? true : false,
        deprecated === "true" ? true : false
      ),
    };
  }
  throw new Response("Community not found", { status: 404 });
}

export default function Community() {
  const { community, filters, listings } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  const outletContext = useOutletContext() as OutletContextShape;

  const listingsAndFiltersMemo = useMemo(
    () => Promise.all([listings, filters]),
    []
  );

  return (
    <>
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
      <Suspense
        fallback={
          <span>
            <span>Loading...</span>
          </span>
        }
      >
        <Await resolve={community}>
          {(resolvedValue) => (
            <div className="community__background">
              {resolvedValue.hero_image_url ? (
                <img
                  src={resolvedValue.hero_image_url}
                  alt={resolvedValue.name}
                  className="community__background-image"
                />
              ) : null}
              <div className="community__background-tint" />
            </div>
          )}
        </Await>
      </Suspense>
      <div className="container container--y container--full layout__content community">
        <NewBreadCrumbs>
          <NewBreadCrumbsLink
            primitiveType="cyberstormLink"
            linkId="Communities"
            csVariant="cyber"
          >
            Communities
          </NewBreadCrumbsLink>
          <Suspense
            fallback={
              <span>
                <span>Loading...</span>
              </span>
            }
          >
            <Await resolve={community}>
              {(resolvedValue) => (
                <span>
                  <span>{resolvedValue.name}</span>
                </span>
              )}
            </Await>
          </Suspense>
        </NewBreadCrumbs>
        <Suspense
          fallback={
            <span>
              <span>Loading...</span>
            </span>
          }
        >
          <Await resolve={community}>
            {(resolvedValue) => (
              <PageHeader
                headingLevel="1"
                headingSize="3"
                variant="simple"
                icon={resolvedValue.community_icon_url}
                meta={
                  <>
                    {resolvedValue.wiki_url ? (
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
                    ) : null}
                    {resolvedValue.discord_url ? (
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
                    ) : null}
                  </>
                }
              >
                {resolvedValue.name}
              </PageHeader>
            )}
          </Await>
        </Suspense>
        <Suspense
          fallback={
            <span>
              <span>Loading...</span>
            </span>
          }
        >
          <Await resolve={listingsAndFiltersMemo}>
            {(resolvedValue) => (
              <>
                <PackageSearch
                  listings={resolvedValue[0]}
                  packageCategories={resolvedValue[1].package_categories}
                  sections={resolvedValue[1].sections}
                  config={outletContext.requestConfig}
                  currentUser={outletContext.currentUser}
                  dapper={outletContext.dapper}
                />
              </>
            )}
          </Await>
        </Suspense>
      </div>
    </>
  );
}
