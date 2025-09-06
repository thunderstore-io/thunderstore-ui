import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useOutletContext } from "react-router";
import { PackageSearch } from "~/commonComponents/PackageSearch/PackageSearch";
import { PackageOrderOptions } from "~/commonComponents/PackageSearch/components/PackageOrder";
import { DapperTs } from "@thunderstore/dapper-ts";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { OutletContextShape } from "~/root";

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
    const filters = dapper.getCommunityFilters(params.communityId);

    return {
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
    const filters = dapper.getCommunityFilters(params.communityId);
    return {
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
