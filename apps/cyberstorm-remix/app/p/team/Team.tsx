import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { CyberstormLink, NewBreadCrumbs } from "@thunderstore/cyberstorm";
import "./Team.css";
import { PackageSearch } from "~/commonComponents/PackageSearch/PackageSearch";
import { ApiError } from "@thunderstore/thunderstore-api";
import { DapperTs } from "@thunderstore/dapper-ts";
import { PackageOrderOptions } from "../../commonComponents/PackageSearch/components/PackageOrder";
import { OutletContextShape } from "../../root";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.community.name },
    { name: "description", content: `Mods for ${data?.community.name}` },
  ];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId) {
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
        team: params.namespaceId,
        filters: filters,
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
        throw new Response("Package not found", { status: 404 });
      } else {
        throw error;
      }
    }
  }
  throw new Response("Package not found", { status: 404 });
}

export async function clientLoader({ request, params }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId) {
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
        team: params.namespaceId,
        filters: filters,
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
        throw new Response("Package not found", { status: 404 });
      } else {
        throw error;
      }
    }
  }
  throw new Response("Package not found", { status: 404 });
}

export default function Team() {
  const { community, team, filters, listings, sortedSections } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  const outletContext = useOutletContext() as OutletContextShape;

  return (
    <div className="container container--y container--full layout__content">
      <NewBreadCrumbs>
        <CyberstormLink linkId="Communities">Communities</CyberstormLink>
        <CyberstormLink linkId="Community" community={community.identifier}>
          {community.name}
        </CyberstormLink>
        {team}
      </NewBreadCrumbs>
      <section className="team">
        <span className="team__header">Mods uploaded by {team}</span>
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
