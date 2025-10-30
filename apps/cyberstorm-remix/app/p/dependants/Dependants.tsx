import { Await, useLoaderData, useOutletContext } from "react-router";
import {
  formatToDisplayName,
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
import { Suspense } from "react";
import { throwUserFacingPayloadResponse } from "cyberstorm/utils/errors/userFacingErrorResponse";
import { handleLoaderError } from "cyberstorm/utils/errors/handleLoaderError";
import {
  FORBIDDEN_MAPPING,
  SIGN_IN_REQUIRED_MAPPING,
  VALIDATION_MAPPING,
  createNotFoundMapping,
} from "cyberstorm/utils/errors/loaderMappings";

const dependantsErrorMappings = [
  SIGN_IN_REQUIRED_MAPPING,
  FORBIDDEN_MAPPING,
  VALIDATION_MAPPING,
  createNotFoundMapping(
    "Package not found.",
    "We could not find the requested package."
  ),
];

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
    const filters = dapper
      .getCommunityFilters(params.communityId)
      .catch((error) =>
        handleLoaderError(error, { mappings: dependantsErrorMappings })
      );
    const community = dapper
      .getCommunity(params.communityId)
      .catch((error) =>
        handleLoaderError(error, { mappings: dependantsErrorMappings })
      );
    const listing = dapper
      .getPackageListingDetails(
        params.communityId,
        params.namespaceId,
        params.packageId
      )
      .catch((error) =>
        handleLoaderError(error, { mappings: dependantsErrorMappings })
      );
    const listings = dapper
      .getPackageListings(
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
      )
      .catch((error) =>
        handleLoaderError(error, { mappings: dependantsErrorMappings })
      );

    return {
      community,
      listing,
      filters,
      listings,
    };
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
  >();

  const outletContext = useOutletContext() as OutletContextShape;

  return (
    <>
      <section className="dependants">
        <Suspense fallback={<SkeletonBox />}>
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
        </Suspense>
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
