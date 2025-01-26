import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Heading,
  Image,
  NewBreadCrumbs,
  NewIcon,
  NewLink,
} from "@thunderstore/cyberstorm";
import "./Community.css";
import { PackageSearch } from "~/commonComponents/PackageSearch/PackageSearch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { ApiError } from "@thunderstore/thunderstore-api";
import { PackageOrderOptions } from "~/commonComponents/PackageSearch/PackageOrder";
import { faArrowUpRight } from "@fortawesome/pro-solid-svg-icons";
import { DapperTs } from "@thunderstore/dapper-ts";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.community.name },
    { name: "description", content: `Mods for ${data?.community.name}` },
  ];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  if (params.communityId) {
    try {
      const dapper = new DapperTs(() => {
        return {
          apiHost: process.env.PUBLIC_API_URL,
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
      const community = await dapper.getCommunity(params.communityId);
      const filters = await dapper.getCommunityFilters(params.communityId);
      return {
        community: community,
        filters: filters,
        listings: await dapper.getPackageListings(
          {
            kind: "community",
            communityId: params.communityId,
          },
          ordering ?? "",
          page === null ? undefined : Number(page),
          search ?? "",
          includedCategories?.split(",") ?? undefined,
          excludedCategories?.split(",") ?? undefined,
          section
            ? section === "all"
              ? ""
              : section
            : filters.sections && filters.sections[0]
              ? filters.sections[0].uuid
              : "",
          nsfw === "true" ? true : false,
          deprecated === "true" ? true : false
        ),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Response("Community not found", { status: 404 });
      } else {
        throw error;
      }
    }
  }
  throw new Response("Community not found", { status: 404 });
}

export async function clientLoader({ request, params }: LoaderFunctionArgs) {
  if (params.communityId) {
    try {
      const dapper = window.Dapper;
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
      const community = await dapper.getCommunity(params.communityId);
      const filters = await dapper.getCommunityFilters(params.communityId);
      return {
        community: community,
        filters: filters,
        listings: await dapper.getPackageListings(
          {
            kind: "community",
            communityId: params.communityId,
          },
          ordering ?? "",
          page === null ? undefined : Number(page),
          search ?? "",
          includedCategories?.split(",") ?? undefined,
          excludedCategories?.split(",") ?? undefined,
          section
            ? section === "all"
              ? ""
              : section
            : filters.sections && filters.sections[0]
              ? filters.sections[0].uuid
              : "",
          nsfw === "true" ? true : false,
          deprecated === "true" ? true : false
        ),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Response("Community not found", { status: 404 });
      } else {
        throw error;
      }
    }
  }
  throw new Response("Community not found", { status: 404 });
}

export default function Community() {
  const { community, filters, listings } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  return (
    <>
      <div className="ts-container ts-container--y ts-container--full nimbus-root__content">
        <NewBreadCrumbs rootClasses="nimbus-root__breadcrumbs">
          <NewLink
            primitiveType="cyberstormLink"
            linkId="Communities"
            csVariant="cyber"
          >
            Communities
          </NewLink>
          {community.name}
        </NewBreadCrumbs>
        <section className="ts-container ts-container--y ts-container--full nimbus-community">
          <span className="ts-container ts-container--x __heading">
            <Image
              src={community.cover_image_url}
              cardType="community"
              intrinsicWidth={56}
              intrinsicHeight={56}
              rootClasses="__communitySmallImage"
            />
            <span className="ts-container ts-container--full __content">
              <Heading
                csLevel="1"
                csSize="3"
                mode="display"
                rootClasses="ts-container ts-container--full __info"
              >
                {community.name}
              </Heading>
              <span className="ts-container ts-container--x __meta">
                {community.wiki_url ? (
                  <NewLink
                    primitiveType="link"
                    href={community.wiki_url}
                    csVariant="cyber"
                    rootClasses="__item"
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
                    rootClasses="__item"
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
              </span>
            </span>
          </span>
          <PackageSearch
            listings={listings}
            packageCategories={filters.package_categories}
            sections={filters.sections}
          />
        </section>
      </div>
    </>
  );
}
