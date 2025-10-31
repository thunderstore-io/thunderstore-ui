import { Suspense, useMemo } from "react";
import {
  Await,
  useLoaderData,
  useOutletContext,
  useRouteError,
} from "react-router";
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
import { resolveRouteErrorPayload } from "cyberstorm/utils/errors/resolveRouteErrorPayload";
import {
  isLoaderError,
  resolveLoaderPromise,
  type LoaderErrorPayload,
  type LoaderResult,
} from "cyberstorm/utils/errors/loaderResult";
import { Heading } from "@thunderstore/cyberstorm";
import {
  FORBIDDEN_MAPPING,
  RATE_LIMIT_MAPPING,
  SIGN_IN_REQUIRED_MAPPING,
  VALIDATION_MAPPING,
  createNotFoundMapping,
  createServerErrorMapping,
} from "cyberstorm/utils/errors/loaderMappings";

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

type CommunityFiltersResult = Awaited<
  ReturnType<DapperTs["getCommunityFilters"]>
>;
type PackageListingsResult = Awaited<
  ReturnType<DapperTs["getPackageListings"]>
>;

type MaybePromise<T> = T | Promise<T>;

type PackageSearchLoaderData = {
  filters: MaybePromise<LoaderResult<CommunityFiltersResult>>;
  listings: MaybePromise<LoaderResult<PackageListingsResult>>;
};

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

      const [filters, listings] = await Promise.all([
        dapper.getCommunityFilters(params.communityId),
        dapper.getPackageListings(
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
      ]);

      return {
        filters,
        listings,
      } satisfies PackageSearchLoaderData;
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
      filters: resolveLoaderPromise(
        dapper.getCommunityFilters(params.communityId),
        { mappings: packageSearchErrorMappings }
      ),
      listings: resolveLoaderPromise(
        dapper.getPackageListings(
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
        { mappings: packageSearchErrorMappings }
      ),
    } satisfies PackageSearchLoaderData;
  }
  throwUserFacingPayloadResponse({
    headline: "Community not found.",
    description: "We could not find the requested community.",
    category: "not_found",
    status: 404,
  });
}

// function shouldRevalidate(arg: ShouldRevalidateFunctionArgs) {
//   return true; // false
// }

export default function CommunityPackageSearch() {
  const { filters, listings } = useLoaderData<
    typeof loader | typeof clientLoader
  >() as PackageSearchLoaderData;

  const outletContext = useOutletContext() as OutletContextShape;

  const filtersPromise = useMemo(() => {
    return Promise.resolve(filters) as Promise<
      LoaderResult<CommunityFiltersResult>
    >;
  }, [filters]);

  const listingsPromise = useMemo(() => {
    return Promise.resolve(listings) as Promise<
      LoaderResult<PackageListingsResult>
    >;
  }, [listings]);

  const combinedPromise = useMemo(
    () =>
      Promise.all([filtersPromise, listingsPromise]).then(
        ([filtersResult, listingsResult]) => ({
          filtersResult,
          listingsResult,
        })
      ),
    [filtersPromise, listingsPromise]
  );

  return (
    <Suspense>
      <Await resolve={combinedPromise}>
        {({ filtersResult, listingsResult }) => {
          if (isLoaderError(filtersResult)) {
            return <PackageSearchAwaitError payload={filtersResult.__error} />;
          }

          if (isLoaderError(listingsResult)) {
            return <PackageSearchAwaitError payload={listingsResult.__error} />;
          }

          return (
            <PackageSearch
              listings={listingsResult}
              filters={filtersResult}
              config={outletContext.requestConfig}
              currentUser={outletContext.currentUser}
              dapper={outletContext.dapper}
            />
          );
        }}
      </Await>
    </Suspense>
  );
}

/**
 * Displays a loader error payload inline when package search data fails to resolve.
 */
function PackageSearchAwaitError(props: { payload: LoaderErrorPayload }) {
  const { payload } = props;

  return (
    <div className="container container--y container--full package-search__error">
      <Heading csLevel="2" csSize="3" csVariant="primary" mode="display">
        {payload.headline}
      </Heading>
      {payload.description ? (
        <p className="package-search__error-description">
          {payload.description}
        </p>
      ) : null}
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const payload = resolveRouteErrorPayload(error);

  return (
    <div className="container container--y container--full package-search__error">
      <Heading csLevel="2" csSize="3" csVariant="primary" mode="display">
        {payload.headline}
      </Heading>
      {payload.description ? (
        <p className="package-search__error-description">
          {payload.description}
        </p>
      ) : null}
    </div>
  );
}
