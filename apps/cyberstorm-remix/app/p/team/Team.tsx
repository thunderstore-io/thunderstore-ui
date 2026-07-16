import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { getApiHostForSsr, getCanonicalUrl } from "cyberstorm/utils/env";
import { createSeo } from "cyberstorm/utils/meta";
import { getSectionDefault } from "cyberstorm/utils/section";
import { ssrLoader } from "cyberstorm/utils/ssrLoader";
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
      const search = searchParams.get("search");
      const includedCategories = searchParams.get("includedCategories");
      const excludedCategories = searchParams.get("excludedCategories");
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

      return {
        teamId: params.namespaceId,
        filters: filters,
        // Community is required for the breadcrumbs in the root layout
        community: community,
        listings: await dapper.getPackageListings(
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
          finalSection,
          nsfw === "true" ? true : false,
          deprecated === "true" ? true : false
        ),
        seo: createSeo({
          descriptors: [
            {
              title: `Mods uploaded by ${params.namespaceId} | Thunderstore - The ${community.name} Mod Database`,
            },
            {
              name: "description",
              content: `Browse mods uploaded by ${params.namespaceId}`,
            },
            { property: "og:type", content: "website" },
            { property: "og:url", content: getCanonicalUrl(request) },
            {
              property: "og:title",
              content: `Mods by ${params.namespaceId} | Thunderstore`,
            },
            {
              property: "og:description",
              content: `Browse mods uploaded by ${params.namespaceId}`,
            },
            { property: "og:site_name", content: "Thunderstore" },
          ],
        }),
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
    const search = searchParams.get("search");
    const includedCategories = searchParams.get("includedCategories");
    const excludedCategories = searchParams.get("excludedCategories");
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
        page === null ? undefined : Number(page),
        search ?? "",
        includedCategories?.split(",") ?? undefined,
        excludedCategories?.split(",") ?? undefined,
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
