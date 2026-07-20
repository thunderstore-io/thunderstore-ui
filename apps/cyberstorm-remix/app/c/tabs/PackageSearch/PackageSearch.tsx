import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { getApiHostForSsr } from "cyberstorm/utils/env";
import { createSeo } from "cyberstorm/utils/meta";
import {
  parseIntListParam,
  parsePageParam,
} from "cyberstorm/utils/searchParamsUtils";
import { getSectionDefault } from "cyberstorm/utils/section";
import { ssrLoader } from "cyberstorm/utils/ssrLoader";
import { useLoaderData, useOutletContext } from "react-router";
import { SidebarAd } from "~/commonComponents/Ads/SidebarAd";
import { COMMUNITY_SIDEBAR_AD } from "~/commonComponents/Ads/nitroAds";
import { PackageSearch } from "~/commonComponents/PackageSearch/PackageSearch";
import { PackageOrderOptions } from "~/commonComponents/PackageSearch/components/packageOrderOptions";
import { type OutletContextShape } from "~/root";

import { DapperTs } from "@thunderstore/dapper-ts";

import type { Route } from "./+types/PackageSearch";

export const loader = ssrLoader(
  async ({ params, request }: Route.LoaderArgs) => {
    if (params.communityId) {
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

      return {
        filters: filters,
        listings: await dapper.getPackageListings(
          {
            kind: "community",
            communityId: params.communityId,
          },
          ordering ?? "",
          parsePageParam(page),
          search ?? "",
          includedCategories,
          excludedCategories,
          finalSection,
          nsfw === "true" ? true : false,
          deprecated === "true" ? true : false
        ),
        seo: createSeo({
          descriptors: [
            { title: `Packages for ${community.name} | Thunderstore` },
            {
              name: "description",
              content: `Browse packages for ${community.name}`,
            },
          ],
        }),
      };
    }
    throw new Response("Community not found", { status: 404 });
  },
  { cache: true }
);

// The loader is anonymous (sessionId: undefined), so the community landing page
// is CDN-cacheable. Listing freshness is bounded by the default cache window
// (s-maxage=300, swr=600) — an acceptable lag for a mod list.
export { forwardLoaderHeaders as headers } from "cyberstorm/utils/ssrLoader";

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
    const searchParams = new URL(request.url).searchParams;
    const ordering =
      searchParams.get("ordering") ?? PackageOrderOptions.Updated;
    const page = searchParams.get("page");
    const search = searchParams.get("search");
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

    // Non-fatal filters (see SSR loader above): fall back to `null` on failure.
    const filters = await dapper
      .getCommunityFilters(params.communityId)
      .catch(() => null);

    const listingsPromise = (async () => {
      const finalSection = getSectionDefault(section, filters?.sections);

      return dapper.getPackageListings(
        {
          kind: "community",
          communityId: params.communityId,
        },
        ordering ?? "",
        parsePageParam(page),
        search ?? "",
        includedCategories,
        excludedCategories,
        finalSection,
        nsfw === "true" ? true : false,
        deprecated === "true" ? true : false
      );
    })();

    return {
      filters: filters,
      listings: listingsPromise,
    };
  }
  throw new Response("Community not found", { status: 404 });
}

// function shouldRevalidate(arg: ShouldRevalidateFunctionArgs) {
//   return true; // false
// }

export default function CommunityPackageSearch() {
  const { filters, listings } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  const outletContext = useOutletContext() as OutletContextShape;

  // The community route is always ad-allowed, so VITE_DISABLE_ADS (the local /
  // test kill switch) is the only gate. When ads are off we pass no slot, which
  // also keeps the sidebar at its default width.
  const adsDisabled =
    getPublicEnvVariables(["VITE_DISABLE_ADS"]).VITE_DISABLE_ADS === "true";

  return (
    <PackageSearch
      listings={listings}
      filters={filters}
      config={outletContext.requestConfig}
      currentUser={outletContext.currentUser}
      dapper={outletContext.dapper}
      sidebarSlot={
        adsDisabled ? undefined : <SidebarAd slot={COMMUNITY_SIDEBAR_AD} />
      }
      withDisplayControls
    />
  );
}
