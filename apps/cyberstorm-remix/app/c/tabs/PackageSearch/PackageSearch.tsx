import { useLoaderData, useOutletContext } from "react-router";
import { PackageSearch } from "~/commonComponents/PackageSearch/PackageSearch";
import { PackageOrderOptions } from "~/commonComponents/PackageSearch/components/PackageOrder";
import { type OutletContextShape } from "~/root";
import type { Route } from "./+types/PackageSearch";
import { throwUserFacingPayloadResponse } from "cyberstorm/utils/errors/userFacingErrorResponse";
import { handleLoaderError } from "cyberstorm/utils/errors/handleLoaderError";
import { createNotFoundMapping } from "cyberstorm/utils/errors/loaderMappings";
import { NimbusDefaultRouteErrorBoundary } from "cyberstorm/utils/errors/NimbusErrorBoundary";
import { getLoaderTools } from "cyberstorm/utils/getLoaderTools";
import { parseIntegerSearchParam } from "cyberstorm/utils/searchParamsUtils";

interface PackageSearchQuery {
  ordering: string;
  page: number | undefined;
  search: string;
  includedCategories: string[] | undefined;
  excludedCategories: string[] | undefined;
  section: string;
  nsfw: boolean;
  deprecated: boolean;
}

const communityNotFoundMappings = [
  createNotFoundMapping(
    "Community not found.",
    "We could not find the requested community."
  ),
];

function resolvePackageSearchQuery(request: Request): PackageSearchQuery {
  const searchParams = new URL(request.url).searchParams;
  const ordering = searchParams.get("ordering") ?? PackageOrderOptions.Updated;
  const page = parseIntegerSearchParam(searchParams.get("page"));
  const search = searchParams.get("search") ?? "";
  const included = searchParams.get("includedCategories");
  const excluded = searchParams.get("excludedCategories");
  const sectionParam = searchParams.get("section");
  const section = sectionParam
    ? sectionParam === "all"
      ? ""
      : sectionParam
    : "";
  const nsfw = searchParams.get("nsfw") === "true";
  const deprecated = searchParams.get("deprecated") === "true";

  return {
    ordering,
    page,
    search,
    includedCategories: included?.split(",") ?? undefined,
    excludedCategories: excluded?.split(",") ?? undefined,
    section,
    nsfw,
    deprecated,
  };
}

export async function loader({ params, request }: Route.LoaderArgs) {
  if (params.communityId) {
    const { dapper } = getLoaderTools();
    try {
      const query = resolvePackageSearchQuery(request);

      return {
        filters: await dapper.getCommunityFilters(params.communityId),
        listings: await dapper.getPackageListings(
          {
            kind: "community",
            communityId: params.communityId,
          },
          query.ordering ?? "",
          query.page,
          query.search,
          query.includedCategories,
          query.excludedCategories,
          query.section,
          query.nsfw,
          query.deprecated
        ),
      };
    } catch (error) {
      handleLoaderError(error, { mappings: communityNotFoundMappings });
    }
  }
  throwUserFacingPayloadResponse({
    headline: "Community not found.",
    description: "We could not find the requested community.",
    category: "not_found",
    status: 404,
  });
}

export async function clientLoader({
  request,
  params,
}: Route.ClientLoaderArgs) {
  if (params.communityId) {
    const { dapper } = getLoaderTools();
    const query = resolvePackageSearchQuery(request);
    return {
      filters: dapper
        .getCommunityFilters(params.communityId)
        .catch((error) =>
          handleLoaderError(error, { mappings: communityNotFoundMappings })
        ),
      listings: dapper
        .getPackageListings(
          {
            kind: "community",
            communityId: params.communityId,
          },
          query.ordering ?? "",
          query.page,
          query.search,
          query.includedCategories,
          query.excludedCategories,
          query.section,
          query.nsfw,
          query.deprecated
        )
        .catch((error) =>
          handleLoaderError(error, { mappings: communityNotFoundMappings })
        ),
    };
  }
  throwUserFacingPayloadResponse({
    headline: "Community not found.",
    description: "We could not find the requested community.",
    category: "not_found",
    status: 404,
  });
}

export default function CommunityPackageSearch() {
  const { filters, listings } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  const outletContext = useOutletContext() as OutletContextShape;

  return (
    <PackageSearch
      listings={listings}
      filters={filters}
      config={outletContext.requestConfig}
      currentUser={outletContext.currentUser}
      dapper={outletContext.dapper}
    />
  );
}

export function ErrorBoundary() {
  return <NimbusDefaultRouteErrorBoundary />;
}
