import { useLoaderData, useOutletContext, useRevalidator, useRouteError } from "react-router";
import { PackageSearch } from "~/commonComponents/PackageSearch/PackageSearch";
import { PackageOrderOptions } from "~/commonComponents/PackageSearch/components/PackageOrder";
import { DapperTs } from "@thunderstore/dapper-ts";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { type OutletContextShape } from "~/root";
import type { Route } from "./+types/PackageSearch";
import { throwUserFacingPayloadResponse } from "cyberstorm/utils/errors/userFacingErrorResponse";
import { handleLoaderError } from "cyberstorm/utils/errors/handleLoaderError";
import {
  FORBIDDEN_MAPPING,
  RATE_LIMIT_MAPPING,
  SIGN_IN_REQUIRED_MAPPING,
  VALIDATION_MAPPING,
  createNotFoundMapping,
  createServerErrorMapping,
} from "cyberstorm/utils/errors/loaderMappings";
import { NimbusErrorBoundaryFallback } from "~/commonComponents/NimbusErrorBoundary";
import type { NimbusErrorBoundaryFallbackProps } from "~/commonComponents/NimbusErrorBoundary";

const packageSearchErrorMappings = [
  SIGN_IN_REQUIRED_MAPPING,
  FORBIDDEN_MAPPING,
  VALIDATION_MAPPING,
  RATE_LIMIT_MAPPING,
  createNotFoundMapping(
    "Community not found.",
    "We could not find the requested community."
  ),
  createServerErrorMapping(),
];

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

function resolvePackageSearchQuery(request: Request): PackageSearchQuery {
  const searchParams = new URL(request.url).searchParams;
  const ordering = searchParams.get("ordering") ?? PackageOrderOptions.Updated;
  const pageParam = searchParams.get("page");
  const page = pageParam === null ? undefined : Number(pageParam);
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
    const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
    const dapper = new DapperTs(() => {
      return {
        apiHost: publicEnvVariables.VITE_API_URL,
        sessionId: undefined,
      };
    });
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
      handleLoaderError(error, { mappings: packageSearchErrorMappings });
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
    const tools = getSessionTools();
    const dapper = new DapperTs(() => {
      return {
        apiHost: tools?.getConfig().apiHost,
        sessionId: tools?.getConfig().sessionId,
      };
    });
    const query = resolvePackageSearchQuery(request);
    return {
      filters: dapper.getCommunityFilters(params.communityId),
      listings: dapper.getPackageListings(
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
  }
  throwUserFacingPayloadResponse({
    headline: "Community not found.",
    description: "We could not find the requested community.",
    category: "not_found",
    status: 404,
  });
}

export function HydrateFallback() {
  return <div>Loading...</div>;
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

/**
 * Nimbus wrapper for package search error messaging to keep styling consistent.
 */
function PackageSearchErrorFallback(props: NimbusErrorBoundaryFallbackProps) {
  const { className, retryLabel, ...rest } = props;
  const mergedClassName = className
    ? `${className} package-search__error`
    : "package-search__error";

  return (
    <NimbusErrorBoundaryFallback
      {...rest}
      className={mergedClassName}
      retryLabel={retryLabel ?? "Retry search"}
    />
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const revalidator = useRevalidator();

  return (
    <PackageSearchErrorFallback
      error={error}
      reset={() => {}}
      onRetry={() => revalidator.revalidate()}
      title="Failed to load package search"
      retryLabel="Retry page"
    />
  );
}
