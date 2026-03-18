import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { getApiHostForSsr } from "cyberstorm/utils/env";
import { createSeo } from "cyberstorm/utils/meta";
import { getSectionDefault } from "cyberstorm/utils/section";
import { useLoaderData, useOutletContext } from "react-router";
import { PackageSearch } from "~/commonComponents/PackageSearch/PackageSearch";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";

import { DapperTs } from "@thunderstore/dapper-ts";

import { PackageOrderOptions } from "../../commonComponents/PackageSearch/components/packageOrderOptions";
import { type OutletContextShape } from "../../root";
import type { Route } from "./+types/Team";
import "./Team.css";

export async function loader({ params, request }: Route.LoaderArgs) {
  if (params.communityId && params.namespaceId) {
    const dapper = new DapperTs(() => {
      return {
        apiHost: getApiHostForSsr(),
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
    const filters = await dapper.getCommunityFilters(params.communityId);
    const community = await dapper.getCommunity(params.communityId);

    const finalSection = getSectionDefault(section, filters.sections);

    return {
      teamId: params.namespaceId,
      filters: filters,
      // Community is required for the breadcrumbs in the root layout
      community: community,
      listings: await dapper.getPackageListings(
        {
          kind: "namespace",
          communityId: params.communityId,
          namespaceId: params.namespaceId,
        },
        ordering ?? "",
        page === null ? undefined : Number(page),
        search ?? "",
        includedCategories?.split(",") ?? undefined,
        excludedCategories?.split(",") ?? undefined,
        finalSection,
        nsfw === "true" ? true : false,
        deprecated === "true" ? true : false
      ),
      seo: createSeo({
        descriptors: [
          {
            title: `Mods uploaded by ${params.namespaceId} | Thunderstore - The ${community.name} Mod Database`,
          },
          {
            name: "description",
            content: `Browse mods uploaded by ${params.namespaceId}`,
          },
          { property: "og:type", content: "website" },
          { property: "og:url", content: request.url },
          {
            property: "og:title",
            content: `Mods by ${params.namespaceId} | Thunderstore`,
          },
          {
            property: "og:description",
            content: `Browse mods uploaded by ${params.namespaceId}`,
          },
          { property: "og:site_name", content: "Thunderstore" },
        ],
      }),
    };
  }
  throw new Response("Community not found", { status: 404 });
}

export async function clientLoader({
  request,
  params,
  serverLoader,
}: Route.ClientLoaderArgs) {
  if (params.communityId && params.namespaceId) {
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

    const serverData = await serverLoader();
    const filters = serverData.filters;
    const community = serverData.community;

    const listingsPromise = (async () => {
      const finalSection = getSectionDefault(section, filters.sections);

      return dapper.getPackageListings(
        {
          kind: "namespace",
          communityId: params.communityId,
          namespaceId: params.namespaceId,
        },
        ordering ?? "",
        page === null ? undefined : Number(page),
        search ?? "",
        includedCategories?.split(",") ?? undefined,
        excludedCategories?.split(",") ?? undefined,
        finalSection,
        nsfw === "true" ? true : false,
        deprecated === "true" ? true : false
      );
    })();

    return {
      teamId: params.namespaceId,
      filters: filters,
      // Community is required for the breadcrumbs in the root layout
      community: community,
      listings: listingsPromise,
      seo: serverData.seo,
    };
  }
  throw new Response("Community not found", { status: 404 });
}

export default function Team() {
  const { filters, listings, teamId } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  const outletContext = useOutletContext() as OutletContextShape;

  return (
    <>
      <section className="team">
        <PageHeader headingLevel="1" headingSize="3">
          Mods uploaded by {teamId}
        </PageHeader>
        <>
          <PackageSearch
            listings={listings}
            filters={filters}
            config={outletContext.requestConfig}
            currentUser={outletContext.currentUser}
            dapper={outletContext.dapper}
          />
        </>
      </section>
    </>
  );
}
