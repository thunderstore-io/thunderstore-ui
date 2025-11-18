import { Await, useLoaderData, useOutletContext } from "react-router";
import {
  formatToDisplayName,
  NewLink,
  SkeletonBox,
} from "@thunderstore/cyberstorm";
import "./Dependants.css";
import { PackageSearch } from "~/commonComponents/PackageSearch/PackageSearch";
import { PackageOrderOptions } from "../../commonComponents/PackageSearch/components/PackageOrder";
import { type OutletContextShape } from "../../root";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";
import {
  NimbusAwaitErrorElement,
  NimbusDefaultRouteErrorBoundary,
} from "cyberstorm/utils/errors/NimbusErrorBoundary";
import type { Route } from "./+types/Dependants";
import { Suspense } from "react";
import { throwUserFacingPayloadResponse } from "cyberstorm/utils/errors/userFacingErrorResponse";
import { handleLoaderError } from "cyberstorm/utils/errors/handleLoaderError";
import { createNotFoundMapping } from "cyberstorm/utils/errors/loaderMappings";
import { getLoaderTools } from "cyberstorm/utils/getLoaderTools";
import { parseIntegerSearchParam } from "cyberstorm/utils/searchParamsUtils";

const packageDependantsNotFoundMappings = [
  createNotFoundMapping(
    "Package not found.",
    "We could not find the requested package."
  ),
];

export async function loader({ params, request }: Route.LoaderArgs) {
  if (params.communityId && params.packageId && params.namespaceId) {
    const { dapper } = getLoaderTools();
    const searchParams = new URL(request.url).searchParams;
    const ordering =
      searchParams.get("ordering") ?? PackageOrderOptions.Updated;
    const page = parseIntegerSearchParam(searchParams.get("page"));
    const search = searchParams.get("search");
    const includedCategories = searchParams.get("includedCategories");
    const excludedCategories = searchParams.get("excludedCategories");
    const section = searchParams.get("section");
    const nsfw = searchParams.get("nsfw");
    const deprecated = searchParams.get("deprecated");
    try {
      const dataPromise = await Promise.all([
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
          page,
          search ?? "",
          includedCategories?.split(",") ?? undefined,
          excludedCategories?.split(",") ?? undefined,
          section ? (section === "all" ? "" : section) : "",
          nsfw === "true" ? true : false,
          deprecated === "true" ? true : false
        ),
      ]);

      return dataPromise;
    } catch (error) {
      handleLoaderError(error, {
        mappings: packageDependantsNotFoundMappings,
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
  if (params.communityId && params.packageId && params.namespaceId) {
    const { dapper } = getLoaderTools();
    const searchParams = new URL(request.url).searchParams;
    const ordering =
      searchParams.get("ordering") ?? PackageOrderOptions.Updated;
    const page = parseIntegerSearchParam(searchParams.get("page"));
    const search = searchParams.get("search");
    const includedCategories = searchParams.get("includedCategories");
    const excludedCategories = searchParams.get("excludedCategories");
    const section = searchParams.get("section");
    const nsfw = searchParams.get("nsfw");
    const deprecated = searchParams.get("deprecated");

    const dataPromise = Promise.all([
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
        page,
        search ?? "",
        includedCategories?.split(",") ?? undefined,
        excludedCategories?.split(",") ?? undefined,
        section ? (section === "all" ? "" : section) : "",
        nsfw === "true",
        deprecated === "true"
      ),
    ]);

    return dataPromise;
  }
  throwUserFacingPayloadResponse({
    headline: "Community not found.",
    description: "We could not find the requested community.",
    category: "not_found",
    status: 404,
  });
}

export default function Dependants() {
  const data = useLoaderData<typeof loader | typeof clientLoader>();

  const outletContext = useOutletContext() as OutletContextShape;

  return (
    <section className="dependants">
      <Suspense fallback={<SkeletonBox />}>
        <Await resolve={data} errorElement={<NimbusAwaitErrorElement />}>
          {(resolvedData) => {
            const [communityFilters, community, listingDetail, listings] =
              resolvedData;
            return (
              <>
                <PageHeader headingLevel="1" headingSize="3">
                  Mods that depend on{" "}
                  <NewLink
                    primitiveType="cyberstormLink"
                    linkId="Package"
                    community={community.identifier}
                    namespace={listingDetail.namespace}
                    package={listingDetail.name}
                    csVariant="cyber"
                  >
                    {formatToDisplayName(listingDetail.name)}
                  </NewLink>
                  {" by "}
                  <NewLink
                    primitiveType="cyberstormLink"
                    linkId="Team"
                    community={listingDetail.community_identifier}
                    team={listingDetail.namespace}
                    csVariant="cyber"
                  >
                    {listingDetail.namespace}
                  </NewLink>
                </PageHeader>
                <PackageSearch
                  listings={listings}
                  filters={communityFilters}
                  config={outletContext.requestConfig}
                  currentUser={outletContext.currentUser}
                  dapper={outletContext.dapper}
                />
              </>
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
