import {
  Await,
  useLoaderData,
  useOutletContext,
  useRouteError,
} from "react-router";
import "./Team.css";
import { PackageSearch } from "~/commonComponents/PackageSearch/PackageSearch";
import { DapperTs } from "@thunderstore/dapper-ts";
import { PackageOrderOptions } from "../../commonComponents/PackageSearch/components/PackageOrder";
import { type OutletContextShape } from "../../root";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import type { Route } from "./+types/Team";
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
import { NewAlert } from "@thunderstore/cyberstorm";
import { resolveRouteErrorPayload } from "cyberstorm/utils/errors/resolveRouteErrorPayload";
import { Suspense, useMemo } from "react";
import {
  isLoaderError,
  resolveLoaderPromise,
  type LoaderErrorPayload,
  type LoaderResult,
} from "cyberstorm/utils/errors/loaderResult";

const teamErrorMappings = [
  SIGN_IN_REQUIRED_MAPPING,
  FORBIDDEN_MAPPING,
  VALIDATION_MAPPING,
  RATE_LIMIT_MAPPING,
  createNotFoundMapping(
    "Team not found.",
    "We could not find the requested team.",
    404
  ),
  createServerErrorMapping(),
];

type MaybePromise<T> = T | Promise<T>;

type FiltersResult = Awaited<ReturnType<DapperTs["getCommunityFilters"]>>;
type ListingsResult = Awaited<ReturnType<DapperTs["getPackageListings"]>>;

type LoaderData = {
  teamId: string;
  filters: MaybePromise<LoaderResult<FiltersResult>>;
  listings: MaybePromise<LoaderResult<ListingsResult>>;
};

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
    try {
      const filters = await dapper.getCommunityFilters(params.communityId);
      const listings = await dapper.getPackageListings(
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
        nsfw === "true",
        deprecated === "true"
      );

      return {
        teamId: params.namespaceId,
        filters,
        listings,
      } satisfies LoaderData;
    } catch (error) {
      handleLoaderError(error, { mappings: teamErrorMappings });
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
    return {
      teamId: params.namespaceId,
      filters: resolveLoaderPromise(
        dapper.getCommunityFilters(params.communityId),
        { mappings: teamErrorMappings }
      ),
      listings: resolveLoaderPromise(
        dapper.getPackageListings(
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
          nsfw === "true",
          deprecated === "true"
        ),
        { mappings: teamErrorMappings }
      ),
    } satisfies LoaderData;
  }
  throwUserFacingPayloadResponse({
    headline: "Community not found.",
    description: "We could not find the requested community.",
    category: "not_found",
    status: 404,
  });
}

/**
 * Displays the team package listing and delegates streaming data to PackageSearch.
 */
export default function Team() {
  const { filters, listings, teamId } = useLoaderData<
    typeof loader | typeof clientLoader
  >() as LoaderData;

  const outletContext = useOutletContext() as OutletContextShape;
  const filtersPromise = useMemo(() => {
    return Promise.resolve(filters) as Promise<LoaderResult<FiltersResult>>;
  }, [filters]);
  const listingsPromise = useMemo(() => {
    return Promise.resolve(listings) as Promise<LoaderResult<ListingsResult>>;
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
    <>
      <section className="team">
        <PageHeader headingLevel="1" headingSize="3">
          Mods uploaded by {teamId}
        </PageHeader>
        <Suspense fallback={<TeamPackageSearchSkeleton />}>
          <Await resolve={combinedPromise}>
            {({ filtersResult, listingsResult }) => {
              if (isLoaderError(filtersResult)) {
                return (
                  <TeamPackageSearchAwaitError
                    payload={filtersResult.__error}
                  />
                );
              }

              if (isLoaderError(listingsResult)) {
                return (
                  <TeamPackageSearchAwaitError
                    payload={listingsResult.__error}
                  />
                );
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
      </section>
    </>
  );
}

/**
 * Displays an inline error message if the package search data fails to resolve.
 */
function TeamPackageSearchAwaitError(props: { payload: LoaderErrorPayload }) {
  const { payload } = props;

  return (
    <NewAlert csVariant="danger">
      <strong>{payload.headline}</strong>
      {payload.description ? ` ${payload.description}` : ""}
    </NewAlert>
  );
}

/**
 * Shows a lightweight placeholder while awaiting Team package search data.
 */
function TeamPackageSearchSkeleton() {
  return <div className="team__packages-loading" />;
}

/**
 * Maps loader errors to a user-facing alert for the team route.
 */
export function ErrorBoundary() {
  const error = useRouteError();
  const payload = resolveRouteErrorPayload(error);

  return (
    <NewAlert csVariant="danger">
      <strong>{payload.headline}</strong>
      {payload.description ? ` ${payload.description}` : ""}
    </NewAlert>
  );
}
