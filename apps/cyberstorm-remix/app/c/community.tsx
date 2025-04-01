import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, useOutletContext } from "@remix-run/react";
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
import { ApiError } from "@thunderstore/thunderstore-api";
import { PackageOrderOptions } from "~/commonComponents/PackageSearch/components/PackageOrder";
import { faArrowUpRight } from "@fortawesome/pro-solid-svg-icons";
import { DapperTs } from "@thunderstore/dapper-ts";
import { OutletContextShape } from "../root";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";
import { getPublicEnvVariables } from "cyberstorm/security/publicEnvVariables";

export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
  return [
    { title: `Thunderstore - The ${data?.community.name} Mod Database` },
    { name: "description", content: `Mods for ${data?.community.name}` },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:url",
      content: `${getPublicEnvVariables(["PUBLIC_SITE_URL"]).PUBLIC_SITE_URL}${
        location.pathname
      }`,
    },
    {
      property: "og:title",
      content: `Thunderstore - The ${data?.community.name} Mod Database`,
    },
    {
      property: "og:description",
      content: data
        ? `Thunderstore is a mod database and API for downloading ${data.community.name} mods`
        : undefined,
    },
    {
      property: "og:image:width",
      content: "360",
    },
    {
      property: "og:image:height",
      content: "480",
    },
    {
      property: "og:image",
      content: data?.community.cover_image_url,
    },
    {
      property: "og:site_name",
      content: "Thunderstore",
    },
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
      const sortedSections = filters.sections.sort(
        (a, b) => b.priority - a.priority
      );
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
            : sortedSections && sortedSections[0]
              ? sortedSections[0].uuid
              : "",
          nsfw === "true" ? true : false,
          deprecated === "true" ? true : false
        ),
        sortedSections: sortedSections,
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
      const sortedSections = filters.sections.sort(
        (a, b) => b.priority - a.priority
      );
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
            : sortedSections && sortedSections[0]
              ? sortedSections[0].uuid
              : "",
          nsfw === "true" ? true : false,
          deprecated === "true" ? true : false
        ),
        sortedSections: sortedSections,
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
  const { community, filters, listings, sortedSections } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  const outletContext = useOutletContext() as OutletContextShape;

  return (
    <div className="container container--y container--full layout__content community">
      <NewBreadCrumbs>
        <NewBreadCrumbsLink
          primitiveType="cyberstormLink"
          linkId="Communities"
          csVariant="cyber"
        >
          Communities
        </NewBreadCrumbsLink>
        <span>
          <span>{community.name}</span>
        </span>
      </NewBreadCrumbs>
      <section className="container container--y container--full">
        <div className="container container--x community__heading">
          <PageHeader
            headingLevel="1"
            headingSize="3"
            variant="simple"
            icon={community.cover_image_url}
            meta={
              <>
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
              </>
            }
          >
            {community.name}
          </PageHeader>
        </div>
        <PackageSearch
          listings={listings}
          packageCategories={filters.package_categories}
          sections={sortedSections}
          config={outletContext.requestConfig}
          currentUser={outletContext.currentUser}
        />
      </section>
    </div>
  );
}
