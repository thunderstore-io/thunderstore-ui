import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  CyberstormLink,
  NewBreadCrumbs,
  NewLink,
} from "@thunderstore/cyberstorm";
import "./Dependants.css";
import { PackageSearch } from "~/commonComponents/PackageSearch/PackageSearch";
import { ApiError } from "@thunderstore/thunderstore-api";
import { DapperTs } from "@thunderstore/dapper-ts";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.community.name },
    { name: "description", content: `Mods for ${data?.community.name}` },
  ];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    try {
      const dapper = new DapperTs(() => {
        return {
          apiHost: process.env.PUBLIC_API_URL,
          sessionId: undefined,
        };
      });
      const searchParams = new URL(request.url).searchParams;
      const order = searchParams.get("order");
      const page = searchParams.get("page");
      const search = searchParams.get("search");
      const includedCategories = searchParams.get("includedCategories");
      const excludedCategories = searchParams.get("excludedCategories");
      const section = searchParams.get("section");
      const nsfw = searchParams.get("nsfw");
      const deprecated = searchParams.get("deprecated");
      return {
        community: await dapper.getCommunity(params.communityId),
        filters: await dapper.getCommunityFilters(params.communityId),
        listing: await dapper.getPackageListingDetails(
          params.communityId,
          params.namespaceId,
          params.packageId
        ),
        listings: await dapper.getPackageListings(
          {
            kind: "package-dependants",
            communityId: params.communityId,
            namespaceId: params.namespaceId,
            packageName: params.packageId,
          },
          order ?? "",
          page === null ? undefined : Number(page),
          search ?? "",
          includedCategories?.split(",") ?? undefined,
          excludedCategories?.split(",") ?? undefined,
          section ?? "",
          nsfw === "true" ? true : false,
          deprecated === "true" ? true : false
        ),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Response("Package not found", { status: 404 });
      } else {
        // REMIX TODO: Add sentry
        throw error;
      }
    }
  }
  throw new Response("Package not found", { status: 404 });
}

export async function clientLoader({ request, params }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    try {
      const dapper = window.Dapper;
      const searchParams = new URL(request.url).searchParams;
      const order = searchParams.get("order");
      const page = searchParams.get("page");
      const search = searchParams.get("search");
      const includedCategories = searchParams.get("includedCategories");
      const excludedCategories = searchParams.get("excludedCategories");
      const section = searchParams.get("section");
      const nsfw = searchParams.get("nsfw");
      const deprecated = searchParams.get("deprecated");
      return {
        community: await dapper.getCommunity(params.communityId),
        filters: await dapper.getCommunityFilters(params.communityId),
        listing: await dapper.getPackageListingDetails(
          params.communityId,
          params.namespaceId,
          params.packageId
        ),
        listings: await dapper.getPackageListings(
          {
            kind: "package-dependants",
            communityId: params.communityId,
            namespaceId: params.namespaceId,
            packageName: params.packageId,
          },
          order ?? "",
          page === null ? undefined : Number(page),
          search ?? "",
          includedCategories?.split(",") ?? undefined,
          excludedCategories?.split(",") ?? undefined,
          section ?? "",
          nsfw === "true" ? true : false,
          deprecated === "true" ? true : false
        ),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Response("Community not found", { status: 404 });
      } else {
        // REMIX TODO: Add sentry
        throw error;
      }
    }
  }
  throw new Response("Community not found", { status: 404 });
}

export default function Dependants() {
  const { community, filters, listing, listings } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  return (
    <div className="container container--y container--full layout__content">
      <NewBreadCrumbs>
        <CyberstormLink linkId="Communities">Communities</CyberstormLink>
        <CyberstormLink linkId="Community" community={community.identifier}>
          {community.name}
        </CyberstormLink>
        <CyberstormLink
          linkId="Team"
          community={community.identifier}
          team={listing.namespace}
        >
          {listing.namespace}
        </CyberstormLink>
        <CyberstormLink
          linkId="Package"
          community={listing.community_identifier}
          namespace={listing.namespace}
          package={listing.name}
        >
          {listing.name}
        </CyberstormLink>
        Dependants
      </NewBreadCrumbs>
      <section className="dependants">
        <span className="dependants__header">
          Mods that depend on{" "}
          <NewLink
            primitiveType="cyberstormLink"
            linkId="Package"
            community={listing.community_identifier}
            namespace={listing.namespace}
            package={listing.name}
            csVariant="cyber"
          >
            {listing.name}
          </NewLink>
          {" by "}
          <NewLink
            primitiveType="cyberstormLink"
            linkId="Team"
            community={listing.community_identifier}
            team={listing.namespace}
            csVariant="cyber"
          >
            {listing.namespace}
          </NewLink>
        </span>
        <PackageSearch
          listings={listings}
          packageCategories={filters.package_categories}
          sections={filters.sections}
        />
      </section>
    </div>
  );
}
