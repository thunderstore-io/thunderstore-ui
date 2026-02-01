import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { getApiHostForSsr } from "cyberstorm/utils/env";
import { Suspense } from "react";
import { Await, useLoaderData, useOutletContext } from "react-router";
import { PackageSearch } from "~/commonComponents/PackageSearch/PackageSearch";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";

import {
  NewLink,
  SkeletonBox,
  formatToDisplayName,
} from "@thunderstore/cyberstorm";
import { DapperTs } from "@thunderstore/dapper-ts";

import { PackageOrderOptions } from "../../commonComponents/PackageSearch/components/PackageOrder";
import { type OutletContextShape } from "../../root";
import type { Route } from "./+types/Dependants";
import "./Dependants.css";

export async function loader({ params, request }: Route.LoaderArgs) {
  if (params.communityId && params.packageId && params.namespaceId) {
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

    return {
      community: dapper.getCommunity(params.communityId),
      listing: dapper.getPackageListingDetails(
        params.communityId,
        params.namespaceId,
        params.packageId
      ),
      filters: filters,
      listings: await dapper.getPackageListings(
        {
          kind: "package-dependants",
          communityId: params.communityId,
          namespaceId: params.namespaceId,
          packageName: params.packageId,
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
  if (params.communityId && params.packageId && params.namespaceId) {
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
      community: dapper.getCommunity(params.communityId),
      listing: dapper.getPackageListingDetails(
        params.communityId,
        params.namespaceId,
        params.packageId
      ),
      filters: filters,
      listings: dapper.getPackageListings(
        {
          kind: "package-dependants",
          communityId: params.communityId,
          namespaceId: params.namespaceId,
          packageName: params.packageId,
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

export default function Dependants() {
  const { filters, listing, listings } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  const outletContext = useOutletContext() as OutletContextShape;

  return (
    <>
      <section className="dependants">
        <Suspense fallback={<SkeletonBox />}>
          <Await resolve={listing}>
            {(resolvedValue) => (
              <PageHeader headingLevel="1" headingSize="3">
                Mods that depend on{" "}
                <NewLink
                  primitiveType="cyberstormLink"
                  linkId="Package"
                  community={resolvedValue.community_identifier}
                  namespace={resolvedValue.namespace}
                  package={resolvedValue.name}
                  csVariant="cyber"
                >
                  {formatToDisplayName(resolvedValue.name)}
                </NewLink>
                {" by "}
                <NewLink
                  primitiveType="cyberstormLink"
                  linkId="Team"
                  community={resolvedValue.community_identifier}
                  team={resolvedValue.namespace}
                  csVariant="cyber"
                >
                  {resolvedValue.namespace}
                </NewLink>
              </PageHeader>
            )}
          </Await>
        </Suspense>
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
