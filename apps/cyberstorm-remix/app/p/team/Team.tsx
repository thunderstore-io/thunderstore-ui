import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { useLoaderData, useOutletContext } from "react-router";
import { PackageSearch } from "~/commonComponents/PackageSearch/PackageSearch";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";

import { DapperTs } from "@thunderstore/dapper-ts";

import { PackageOrderOptions } from "../../commonComponents/PackageSearch/components/PackageOrder";
import { type OutletContextShape } from "../../root";
import type { Route } from "./+types/Team";
import "./Team.css";

export async function loader({ params, request }: Route.LoaderArgs) {
  if (params.communityId && params.namespaceId) {
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
    const filters = await dapper.getCommunityFilters(params.communityId);

    return {
      teamId: params.namespaceId,
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
        section ? (section === "all" ? "" : section) : "",
        nsfw === "true" ? true : false,
        deprecated === "true" ? true : false
      ),
    };
  }
  throw new Response("Community not found", { status: 404 });
}

export async function clientLoader({
  request,
  params,
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
    const filters = dapper.getCommunityFilters(params.communityId);
    return {
      teamId: params.namespaceId,
      filters: filters,
      listings: dapper.getPackageListings(
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
        section ? (section === "all" ? "" : section) : "",
        nsfw === "true" ? true : false,
        deprecated === "true" ? true : false
      ),
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
