import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { getApiHostForSsr } from "cyberstorm/utils/env";
import { createSeo } from "cyberstorm/utils/meta";
import { getSectionDefault } from "cyberstorm/utils/section";
import { useLoaderData, useOutletContext } from "react-router";
import { PackageSearch } from "~/commonComponents/PackageSearch/PackageSearch";
import { PackageOrderOptions } from "~/commonComponents/PackageSearch/components/packageOrderOptions";
import { type OutletContextShape } from "~/root";

import { DapperTs } from "@thunderstore/dapper-ts";

import type { Route } from "./+types/PackageSearch";

export async function loader({ params, request }: Route.LoaderArgs) {
  if (params.communityId) {
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
        finalSection,
        nsfw === "true" ? true : false,
        deprecated === "true" ? true : false
      ),
      seo: createSeo({
        descriptors: [
          { title: `Packages for ${community.name} | Thunderstore` },
          {
            name: "description",
            content: `Browse packages for ${community.name}`,
          },
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

    // Use the filters already fetched by the server so that React Router
    // doesn't send an extra data request during client-side hydration
    const serverData = await serverLoader();
    const filters = serverData.filters;

    const listingsPromise = (async () => {
      const finalSection = getSectionDefault(section, filters.sections);

      return dapper.getPackageListings(
        {
          kind: "community",
          communityId: params.communityId,
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
      filters: filters,
      listings: listingsPromise,
      seo: serverData.seo,
    };
  }
  throw new Response("Community not found", { status: 404 });
}

// function shouldRevalidate(arg: ShouldRevalidateFunctionArgs) {
//   return true; // false
// }

export default function CommunityPackageSearch() {
  const { filters, listings } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  const outletContext = useOutletContext() as OutletContextShape;

  return (
    <>
      <PackageSearch
        listings={listings}
        filters={filters}
        config={outletContext.requestConfig}
        currentUser={outletContext.currentUser}
        dapper={outletContext.dapper}
      />
    </>
  );
}
