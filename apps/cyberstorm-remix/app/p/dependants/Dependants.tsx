import { getPrivateListing, getPublicListing } from "app/p/listingUtils";
import { getDapperForRequest } from "cyberstorm/utils/dapperSingleton";
import { getApiHostForSsr, getCanonicalUrl } from "cyberstorm/utils/env";
import { gatedSsr404 } from "cyberstorm/utils/gatedSsr";
import { createSeo } from "cyberstorm/utils/meta";
import { getSectionDefault } from "cyberstorm/utils/section";
import { ssrLoader } from "cyberstorm/utils/ssrLoader";
import { Suspense } from "react";
import { Await, useLoaderData, useOutletContext } from "react-router";
import { CommunityPackageListingHeader } from "~/c/CommunityPackageListingSubpath";
import { PackageSearch } from "~/commonComponents/PackageSearch/PackageSearch";
import { Page } from "~/commonComponents/Page/Page";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";

import {
  NewLink,
  SkeletonBox,
  formatToDisplayName,
} from "@thunderstore/cyberstorm";
import { DapperTs } from "@thunderstore/dapper-ts";

import { PackageOrderOptions } from "../../commonComponents/PackageSearch/components/packageOrderOptions";
import { type OutletContextShape } from "../../root";
import type { Route } from "./+types/Dependants";

export { RouteErrorBoundary as ErrorBoundary } from "app/commonComponents/ErrorBoundary";

export const loader = ssrLoader(
  async ({ params, request }: Route.LoaderArgs) => {
    if (params.communityId && params.packageId && params.namespaceId) {
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
      // Filters are non-fatal: fall back to `null` so the search still renders
      // with an in-place filters error instead of throwing (TS-3397).
      const [filters, listing] = await Promise.all([
        dapper.getCommunityFilters(params.communityId).catch(() => null),
        getPublicListing(dapper, {
          communityId: params.communityId,
          namespaceId: params.namespaceId,
          packageId: params.packageId,
        }),
      ]);

      // The listing may exist but be hidden from this anonymous request
      // (e.g. rejected listings are still visible to moderators and to the
      // package's team members). Return a gated 404 instead of throwing so
      // the clientLoader gets to retry with the user's session attached.
      // The community and filters are public, so pass them through — the
      // page shell and breadcrumbs render during SSR; only the gated
      // listing and its dependants are deferred to the client refetch.
      if (!listing) {
        return gatedSsr404({
          community: await dapper.getCommunity(params.communityId),
          listing: undefined,
          filters,
          listings: undefined,
          seo: createSeo({ descriptors: [] }),
        });
      }

      const finalSection = getSectionDefault(section, filters?.sections);

      const [community, listings] = await Promise.all([
        dapper.getCommunity(params.communityId),
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
          finalSection,
          nsfw === "true" ? true : false,
          deprecated === "true" ? true : false
        ),
      ]);

      return {
        community,
        listing,
        filters: filters,
        listings,
        seo: createSeo({
          descriptors: [
            {
              title: `Dependants of ${formatToDisplayName(
                listing.name
              )} | Thunderstore`,
            },
            {
              name: "description",
              content: `Mods that depend on ${listing.name}`,
            },
            { property: "og:type", content: "website" },
            { property: "og:url", content: getCanonicalUrl(request) },
            {
              property: "og:title",
              content: `Dependants of ${formatToDisplayName(
                listing.name
              )} | Thunderstore`,
            },
            {
              property: "og:description",
              content: `Mods that depend on ${listing.name}`,
            },
            ...(listing.icon_url
              ? [
                  { property: "og:image", content: listing.icon_url },
                  { property: "og:image:width", content: "256" },
                  { property: "og:image:height", content: "256" },
                ]
              : []),
            { property: "og:site_name", content: "Thunderstore" },
          ],
        }),
      };
    }
    throw new Response("Community not found", { status: 404 });
  },
  { cache: true }
);

export { forwardLoaderHeaders as headers } from "cyberstorm/utils/ssrLoader";

export async function clientLoader({
  request,
  params,
}: Route.ClientLoaderArgs) {
  if (params.communityId && params.packageId && params.namespaceId) {
    const dapper = getDapperForRequest(request);
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
    const community = dapper.getCommunity(params.communityId);
    // Retries with the session attached when the anonymous request 404s,
    // so a permitted user (moderator / team member) sees the page; throws
    // a real 404 only when there is no session or the retry also fails.
    const listing = await getPrivateListing(dapper, {
      communityId: params.communityId,
      namespaceId: params.namespaceId,
      packageId: params.packageId,
    });

    const listingsPromise = (async () => {
      const finalSection = getSectionDefault(section, filters?.sections);

      return dapper.getPackageListings(
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
        finalSection,
        nsfw === "true" ? true : false,
        deprecated === "true" ? true : false
      );
    })();

    return {
      community: community,
      listing: listing,
      filters: filters,
      listings: listingsPromise,
    };
  }
  throw new Response("Community not found", { status: 404 });
}

clientLoader.hydrate = true;

export default function Dependants() {
  const { community, filters, listing, listings } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  const outletContext = useOutletContext() as OutletContextShape;

  // Gated SSR data: the listing was hidden from the anonymous SSR request.
  // The clientLoader refetches it (and its dependants) with the user's
  // session right after hydration, so render a placeholder here.
  if (!listing) {
    return <SkeletonBox />;
  }

  return (
    <Page as="section" rootClasses="dependants">
      <Suspense fallback={null}>
        <Await resolve={community}>
          {(resolvedCommunity) => (
            <CommunityPackageListingHeader
              resolvedCommunity={resolvedCommunity}
            />
          )}
        </Await>
      </Suspense>
      <Suspense fallback={<SkeletonBox />}>
        <Await resolve={listing}>
          {(resolvedValue) => (
            <PageHeader headingLevel="1" headingSize="2">
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
      <PackageSearch
        listings={listings}
        filters={filters}
        config={outletContext.requestConfig}
        currentUser={outletContext.currentUser}
        dapper={outletContext.dapper}
      />
    </Page>
  );
}
