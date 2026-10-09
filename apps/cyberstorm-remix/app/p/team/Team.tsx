import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { getApiHostForSsr, getListingCanonicalUrl } from "cyberstorm/utils/env";
import { type SeoValue, createSeo } from "cyberstorm/utils/meta";
import {
  parseIntListParam,
  parsePageParam,
  parseSearchParam,
} from "cyberstorm/utils/searchParamsUtils";
import { getSectionDefault } from "cyberstorm/utils/section";
import { ssrLoader } from "cyberstorm/utils/ssrLoader";
import { isPromise } from "cyberstorm/utils/typeChecks";
import { useLoaderData, useOutletContext } from "react-router";
import { SidebarAd } from "~/commonComponents/Ads/SidebarAd";
import { TEAM_SIDEBAR_AD } from "~/commonComponents/Ads/nitroAds";
import { PackageSearch } from "~/commonComponents/PackageSearch/PackageSearch";
import { Page } from "~/commonComponents/Page/Page";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";

import { DapperTs } from "@thunderstore/dapper-ts";

import { PackageOrderOptions } from "../../commonComponents/PackageSearch/components/packageOrderOptions";
import { type OutletContextShape } from "../../root";
import type { Route } from "./+types/Team";

export { RouteErrorBoundary as ErrorBoundary } from "app/commonComponents/ErrorBoundary";

const THIN_TEAM_MAX_PACKAGES = 1;

function teamDescriptors(
  teamId: string,
  community: { name: string },
  listings: { count: number },
  request: Request
) {
  return createSeo({
    descriptors: [
      {
        title: `Mods uploaded by ${teamId} · ${community.name} · Thunderstore`,
      },
      {
        name: "description",
        content: `Browse mods uploaded by ${teamId}`,
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: getListingCanonicalUrl(request) },
      {
        property: "og:title",
        content: `Mods by ${teamId} · ${community.name}`,
      },
      {
        property: "og:description",
        content: `Browse mods uploaded by ${teamId}`,
      },
      { property: "og:site_name", content: "Thunderstore" },
      // A one-package team page duplicates the package page.
      ...(listings.count <= THIN_TEAM_MAX_PACKAGES
        ? [{ name: "robots", content: "noindex, follow" }]
        : []),
    ],
  });
}

/**
 * Shared by both loaders, and takes the community and the listings either
 * resolved or still in flight. The client loader's data replaces the server's,
 * so tags only the server emitted would vanish on a client-side navigation into
 * a team and, worse, when paging through one that was server-rendered — the
 * page would be left with the root title and no canonical at all.
 *
 * The client loader keeps streaming both, so the listing is not held up for the
 * sake of a title; <Seo> renders the tags once they arrive. The thin-team
 * noindex needs the package count, so it lands with them, which is soon enough:
 * a crawler is served the server's render, where both are already resolved.
 */
function teamSeo(
  teamId: string,
  community: { name: string } | Promise<{ name: string }>,
  listings: { count: number } | Promise<{ count: number }>,
  request: Request
): SeoValue {
  if (isPromise(community) || isPromise(listings)) {
    return Promise.all([community, listings]).then(
      ([resolvedCommunity, resolvedListings]) =>
        teamDescriptors(teamId, resolvedCommunity, resolvedListings, request),
      // A failed fetch is the route's own business; the tags stay as they are.
      () => undefined
    );
  }
  return teamDescriptors(teamId, community, listings, request);
}

export const loader = ssrLoader(
  async ({ params, request }: Route.LoaderArgs) => {
    if (params.communityId && params.namespaceId) {
      const dapper = new DapperTs(() => {
        return {
          apiHost: getApiHostForSsr(),
          sessionId: undefined,
        };
      });
      const searchParams = new URL(request.url).searchParams;
      const ordering =
        searchParams.get("ordering") ?? PackageOrderOptions.Updated;
      const page = searchParams.get("page");
      const search = parseSearchParam(searchParams.get("search"));
      const includedCategories = parseIntListParam(
        searchParams,
        "includedCategories"
      );
      const excludedCategories = parseIntListParam(
        searchParams,
        "excludedCategories"
      );
      const section = searchParams.get("section");
      const nsfw = searchParams.get("nsfw");
      const deprecated = searchParams.get("deprecated");
      // Non-fatal filters: fall back to `null` on failure so the search still
      // renders with an in-place filters error instead of throwing (TS-3397).
      const filters = await dapper
        .getCommunityFilters(params.communityId)
        .catch(() => null);
      const community = await dapper.getCommunity(params.communityId);

      const finalSection = getSectionDefault(section, filters?.sections);

      const listings = await dapper.getPackageListings(
        {
          kind: "namespace",
          communityId: params.communityId,
          namespaceId: params.namespaceId,
        },
        ordering ?? "",
        parsePageParam(page),
        search,
        includedCategories,
        excludedCategories,
        finalSection,
        nsfw === "true" ? true : false,
        deprecated === "true" ? true : false
      );

      return {
        teamId: params.namespaceId,
        filters: filters,
        // Community is required for the breadcrumbs in the root layout
        community: community,
        listings: listings,
        seo: teamSeo(params.namespaceId, community, listings, request),
      };
    }
    throw new Response("Community not found", { status: 404 });
  },
  { cache: true }
);

// The loader is anonymous, so this team listing page is CDN-cacheable, matching
// the community and dependants PackageSearch routes.
export { forwardLoaderHeaders as headers } from "cyberstorm/utils/ssrLoader";

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
    const search = parseSearchParam(searchParams.get("search"));
    const includedCategories = parseIntListParam(
      searchParams,
      "includedCategories"
    );
    const excludedCategories = parseIntListParam(
      searchParams,
      "excludedCategories"
    );
    const section = searchParams.get("section");
    const nsfw = searchParams.get("nsfw");
    const deprecated = searchParams.get("deprecated");

    const filters = await dapper
      .getCommunityFilters(params.communityId)
      .catch(() => null);
    // Community is required for the breadcrumbs in the root layout
    const community = dapper.getCommunity(params.communityId);

    const listingsPromise = (async () => {
      const finalSection = getSectionDefault(section, filters?.sections);

      return dapper.getPackageListings(
        {
          kind: "namespace",
          communityId: params.communityId,
          namespaceId: params.namespaceId,
        },
        ordering ?? "",
        parsePageParam(page),
        search,
        includedCategories,
        excludedCategories,
        finalSection,
        nsfw === "true" ? true : false,
        deprecated === "true" ? true : false
      );
    })();

    return {
      teamId: params.namespaceId,
      filters: filters,
      community: community,
      listings: listingsPromise,
      seo: teamSeo(params.namespaceId, community, listingsPromise, request),
    };
  }
  throw new Response("Community not found", { status: 404 });
}

export default function Team() {
  const { filters, listings, teamId } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  const outletContext = useOutletContext() as OutletContextShape;

  // VITE_DISABLE_ADS (the local / test kill switch) is the only ad gate on this
  // route; when off we pass no slot, keeping the sidebar at its default width.
  const adsDisabled =
    getPublicEnvVariables(["VITE_DISABLE_ADS"]).VITE_DISABLE_ADS === "true";

  return (
    <Page as="section" rootClasses="team">
      <PageHeader headingLevel="1" headingSize="2">
        Mods uploaded by {teamId}
      </PageHeader>
      <PackageSearch
        listings={listings}
        filters={filters}
        config={outletContext.requestConfig}
        currentUser={outletContext.currentUser}
        dapper={outletContext.dapper}
        teamName={teamId}
        sidebarSlot={
          adsDisabled ? undefined : <SidebarAd slot={TEAM_SIDEBAR_AD} />
        }
        withDisplayControls
      />
    </Page>
  );
}
