import { useLoaderData, useOutletContext } from "react-router";
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
      };
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
    const filtersPromise = dapper.getCommunityFilters(params.communityId);
    const listingsPromise = dapper.getPackageListings(
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

    try {
      await Promise.all([filtersPromise, listingsPromise]);

      return {
        teamId: params.namespaceId,
        filters: filtersPromise,
        listings: listingsPromise,
      };
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

export default function Team() {
  const { filters, listings, teamId } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  const outletContext = useOutletContext() as OutletContextShape;

  return (
    <>
      <section className="team">
        <PageHeader headingLevel="1" headingSize="3">
          Mods uploaded by {teamId}
        </PageHeader>
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
