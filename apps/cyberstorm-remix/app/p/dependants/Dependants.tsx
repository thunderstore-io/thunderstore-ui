import { Await, useLoaderData, useOutletContext } from "react-router";
import {
  formatToDisplayName,
  NewAlert,
  NewLink,
  SkeletonBox,
} from "@thunderstore/cyberstorm";
import "./Dependants.css";
import { PackageSearch } from "~/commonComponents/PackageSearch/PackageSearch";
import { DapperTs } from "@thunderstore/dapper-ts";
import { PackageOrderOptions } from "../../commonComponents/PackageSearch/components/PackageOrder";
import { type OutletContextShape } from "../../root";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import type { Route } from "./+types/Dependants";
import { Suspense, useMemo } from "react";
import { throwUserFacingPayloadResponse } from "cyberstorm/utils/errors/userFacingErrorResponse";
import { handleLoaderError } from "cyberstorm/utils/errors/handleLoaderError";
import {
  FORBIDDEN_MAPPING,
  SIGN_IN_REQUIRED_MAPPING,
  VALIDATION_MAPPING,
  createNotFoundMapping,
} from "cyberstorm/utils/errors/loaderMappings";
import {
  isLoaderError,
  resolveLoaderPromise,
  type LoaderErrorPayload,
  type LoaderResult,
} from "cyberstorm/utils/errors/loaderResult";

const dependantsErrorMappings = [
  SIGN_IN_REQUIRED_MAPPING,
  FORBIDDEN_MAPPING,
  VALIDATION_MAPPING,
  createNotFoundMapping(
    "Package not found.",
    "We could not find the requested package."
  ),
];

type MaybePromise<T> = T | Promise<T>;

type FiltersResult = Awaited<ReturnType<DapperTs["getCommunityFilters"]>>;
type ListingResult = Awaited<ReturnType<DapperTs["getPackageListingDetails"]>>;
type ListingsResult = Awaited<ReturnType<DapperTs["getPackageListings"]>>;

type LoaderData = {
  community: MaybePromise<
    LoaderResult<Awaited<ReturnType<DapperTs["getCommunity"]>>>
  >;
  listing: MaybePromise<LoaderResult<ListingResult>>;
  filters: MaybePromise<LoaderResult<FiltersResult>>;
  listings: MaybePromise<LoaderResult<ListingsResult>>;
};

export async function loader({ params, request }: Route.LoaderArgs) {
  if (params.communityId && params.packageId && params.namespaceId) {
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
      const [filters, community, listing, listings] = await Promise.all([
        dapper.getCommunityFilters(params.communityId),
        dapper.getCommunity(params.communityId),
        dapper.getPackageListingDetails(
          params.communityId,
          params.namespaceId,
          params.packageId
        ),
        dapper.getPackageListings(
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
      ]);

      return {
        community,
        listing,
        filters,
        listings,
      };
    } catch (error) {
      handleLoaderError(error, { mappings: dependantsErrorMappings });
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
    return {
      community: resolveLoaderPromise(dapper.getCommunity(params.communityId), {
        mappings: dependantsErrorMappings,
      }),
      listing: resolveLoaderPromise(
        dapper.getPackageListingDetails(
          params.communityId,
          params.namespaceId,
          params.packageId
        ),
        { mappings: dependantsErrorMappings }
      ),
      filters: resolveLoaderPromise(
        dapper.getCommunityFilters(params.communityId),
        { mappings: dependantsErrorMappings }
      ),
      listings: resolveLoaderPromise(
        dapper.getPackageListings(
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
          nsfw === "true",
          deprecated === "true"
        ),
        { mappings: dependantsErrorMappings }
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

export default function Dependants() {
  const { filters, listing, listings } = useLoaderData<
    typeof loader | typeof clientLoader
  >() as LoaderData;

  const outletContext = useOutletContext() as OutletContextShape;
  const listingPromise = useMemo(() => {
    return Promise.resolve(listing) as Promise<LoaderResult<ListingResult>>;
  }, [listing]);
  const filtersPromise = useMemo(() => {
    return Promise.resolve(filters) as Promise<LoaderResult<FiltersResult>>;
  }, [filters]);
  const listingsPromise = useMemo(() => {
    return Promise.resolve(listings) as Promise<LoaderResult<ListingsResult>>;
  }, [listings]);
  const packageSearchPromise = useMemo(
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
      <section className="dependants">
        <Suspense fallback={<SkeletonBox />}>
          <Await resolve={listingPromise}>
            {(listingResult) =>
              isLoaderError(listingResult) ? (
                <DependantsAwaitError payload={listingResult.__error} />
              ) : (
                <PageHeader headingLevel="1" headingSize="3">
                  Mods that depend on{" "}
                  <NewLink
                    primitiveType="cyberstormLink"
                    linkId="Package"
                    community={listingResult.community_identifier}
                    namespace={listingResult.namespace}
                    package={listingResult.name}
                    csVariant="cyber"
                  >
                    {formatToDisplayName(listingResult.name)}
                  </NewLink>
                  {" by "}
                  <NewLink
                    primitiveType="cyberstormLink"
                    linkId="Team"
                    community={listingResult.community_identifier}
                    team={listingResult.namespace}
                    csVariant="cyber"
                  >
                    {listingResult.namespace}
                  </NewLink>
                </PageHeader>
              )
            }
          </Await>
        </Suspense>
        <Suspense fallback={<SkeletonBox />}>
          <Await resolve={packageSearchPromise}>
            {({ filtersResult, listingsResult }) => {
              if (isLoaderError(filtersResult)) {
                return <DependantsAwaitError payload={filtersResult.__error} />;
              }

              if (isLoaderError(listingsResult)) {
                return (
                  <DependantsAwaitError payload={listingsResult.__error} />
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
 * Renders an inline alert when dependant package data fails to load.
 */
function DependantsAwaitError(props: { payload: LoaderErrorPayload }) {
  const { payload } = props;

  return (
    <div className="dependants__error">
      <NewAlert csVariant="danger">
        <strong>{payload.headline}</strong>
        {payload.description ? ` ${payload.description}` : ""}
      </NewAlert>
    </div>
  );
}
