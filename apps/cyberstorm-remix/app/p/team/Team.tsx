import { Await, useLoaderData, useOutletContext } from "react-router";
import "./Team.css";
import { PackageSearch } from "~/commonComponents/PackageSearch/PackageSearch";
import { PackageOrderOptions } from "../../commonComponents/PackageSearch/components/PackageOrder";
import { type OutletContextShape } from "../../root";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";
import type { Route } from "./+types/Team";
import { throwUserFacingPayloadResponse } from "cyberstorm/utils/errors/userFacingErrorResponse";
import { handleLoaderError } from "cyberstorm/utils/errors/handleLoaderError";
import { createNotFoundMapping } from "cyberstorm/utils/errors/loaderMappings";
import { SkeletonBox } from "@thunderstore/cyberstorm";
import { Suspense } from "react";
import {
  NimbusAwaitErrorElement,
  NimbusDefaultRouteErrorBoundary,
} from "cyberstorm/utils/errors/NimbusErrorBoundary";
import { getLoaderTools } from "cyberstorm/utils/getLoaderTools";

export async function loader({ params, request }: Route.LoaderArgs) {
  if (params.communityId && params.namespaceId) {
    const { dapper } = getLoaderTools();
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
      const dataPromise = Promise.all([filters, listings]);

      return {
        teamId: params.namespaceId,
        filtersAndListings: await dataPromise,
      };
    } catch (error) {
      handleLoaderError(error, {
        mappings: [
          createNotFoundMapping(
            "Team not found.",
            "We could not find the requested team.",
            404
          ),
        ],
      });
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
    const { dapper } = getLoaderTools();
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
    const listings = dapper.getPackageListings(
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
    const dataPromise = Promise.all([filters, listings]);

    return { teamId: params.namespaceId, filtersAndListings: dataPromise };
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
  const data = useLoaderData<typeof loader | typeof clientLoader>();

  const outletContext = useOutletContext() as OutletContextShape;

  return (
    <section className="team">
      <PageHeader headingLevel="1" headingSize="3">
        Mods uploaded by {data.teamId}
      </PageHeader>
      <Suspense fallback={<SkeletonBox />}>
        <Await
          resolve={data.filtersAndListings}
          errorElement={<NimbusAwaitErrorElement />}
        >
          {([filters, listings]) => {
            return (
              <PackageSearch
                listings={listings}
                filters={filters}
                config={outletContext.requestConfig}
                currentUser={outletContext.currentUser}
                dapper={outletContext.dapper}
              />
            );
          }}
        </Await>
      </Suspense>
    </section>
  );
}

export function ErrorBoundary() {
  return <NimbusDefaultRouteErrorBoundary />;
}
