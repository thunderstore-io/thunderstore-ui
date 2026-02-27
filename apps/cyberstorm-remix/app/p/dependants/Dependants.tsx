import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { getApiHostForSsr } from "cyberstorm/utils/env";
import { createSeo } from "cyberstorm/utils/meta";
import { getSectionDefault } from "cyberstorm/utils/section";
import { Await, useLoaderData, useOutletContext } from "react-router";
import { ClientSuspense } from "~/commonComponents/ClientSuspense/ClientSuspense";
import { PackageSearch } from "~/commonComponents/PackageSearch/PackageSearch";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";

import {
  NewLink,
  SkeletonBox,
  formatToDisplayName,
} from "@thunderstore/cyberstorm";
import { DapperTs } from "@thunderstore/dapper-ts";

import { PackageOrderOptions } from "../../commonComponents/PackageSearch/components/packageOrderOptions";
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
    const listing = await dapper.getPackageListingDetails(
      params.communityId,
      params.namespaceId,
      params.packageId
    );

    const finalSection = getSectionDefault(section, filters.sections);

    if (!listing) {
      throw new Response("Package not found", { status: 404 });
    }

    return {
      community: dapper.getCommunity(params.communityId),
      listing,
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
        finalSection,
        nsfw === "true" ? true : false,
        deprecated === "true" ? true : false
      ),
      seo: createSeo({
        descriptors: [
          {
            title: `Dependants of ${formatToDisplayName(
              listing.name
            )} | Thunderstore`,
          },
          {
            name: "description",
            content: `Mods that depend on ${listing.name}`,
          },
          { property: "og:type", content: "website" },
          { property: "og:url", content: request.url },
          {
            property: "og:title",
            content: `Dependants of ${formatToDisplayName(
              listing.name
            )} | Thunderstore`,
          },
          {
            property: "og:description",
            content: `Mods that depend on ${listing.name}`,
          },
          ...(listing.icon_url
            ? [
                { property: "og:image", content: listing.icon_url },
                { property: "og:image:width", content: "256" },
                { property: "og:image:height", content: "256" },
              ]
            : []),
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

    // Leverage identical data coming from serverLoader
    const serverData = await serverLoader();
    const filters = serverData.filters;

    const listingsPromise = (async () => {
      const finalSection = getSectionDefault(section, filters.sections);

      return dapper.getPackageListings(
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
        finalSection,
        nsfw === "true" ? true : false,
        deprecated === "true" ? true : false
      );
    })();

    return {
      community: serverData.community,
      listing: serverData.listing,
      filters: filters,
      listings: listingsPromise,
      seo: serverData.seo,
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
        <ClientSuspense fallback={<SkeletonBox />}>
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
        </ClientSuspense>
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
