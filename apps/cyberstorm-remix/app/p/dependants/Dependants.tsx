import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, useOutletContext } from "react-router";
import {
  formatToDisplayName,
  NewBreadCrumbs,
  NewBreadCrumbsLink,
  NewLink,
} from "@thunderstore/cyberstorm";
import "./Dependants.css";
import { PackageSearch } from "~/commonComponents/PackageSearch/PackageSearch";
import { ApiError } from "@thunderstore/thunderstore-api";
import { DapperTs } from "@thunderstore/dapper-ts";
import { PackageOrderOptions } from "../../commonComponents/PackageSearch/components/PackageOrder";
import { OutletContextShape } from "../../root";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";

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
          apiHost: import.meta.env.VITE_API_URL,
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
      const community = await dapper.getCommunity(params.communityId);
      const filters = await dapper.getCommunityFilters(params.communityId);
      const sortedSections = filters.sections.sort(
        (a, b) => b.priority - a.priority
      );
      return {
        community: community,
        filters: filters,
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
          ordering ?? "",
          page === null ? undefined : Number(page),
          search ?? "",
          includedCategories?.split(",") ?? undefined,
          excludedCategories?.split(",") ?? undefined,
          section
            ? section === "all"
              ? ""
              : section
            : sortedSections && sortedSections[0]
              ? sortedSections[0].uuid
              : "",
          nsfw === "true" ? true : false,
          deprecated === "true" ? true : false
        ),
        sortedSections: sortedSections,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Response("Package not found", { status: 404 });
      } else {
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
      const ordering =
        searchParams.get("ordering") ?? PackageOrderOptions.Updated;
      const page = searchParams.get("page");
      const search = searchParams.get("search");
      const includedCategories = searchParams.get("includedCategories");
      const excludedCategories = searchParams.get("excludedCategories");
      const section = searchParams.get("section");
      const nsfw = searchParams.get("nsfw");
      const deprecated = searchParams.get("deprecated");
      const community = await dapper.getCommunity(params.communityId);
      const filters = await dapper.getCommunityFilters(params.communityId);
      const sortedSections = filters.sections.sort(
        (a, b) => b.priority - a.priority
      );
      return {
        community: community,
        filters: filters,
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
          ordering ?? "",
          page === null ? undefined : Number(page),
          search ?? "",
          includedCategories?.split(",") ?? undefined,
          excludedCategories?.split(",") ?? undefined,
          section
            ? section === "all"
              ? ""
              : section
            : sortedSections && sortedSections[0]
              ? sortedSections[0].uuid
              : "",
          nsfw === "true" ? true : false,
          deprecated === "true" ? true : false
        ),
        sortedSections: sortedSections,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Response("Package not found", { status: 404 });
      } else {
        throw error;
      }
    }
  }
  throw new Response("Package not found", { status: 404 });
}

export default function Dependants() {
  const { community, filters, listing, listings, sortedSections } =
    useLoaderData<typeof loader | typeof clientLoader>();

  const outletContext = useOutletContext() as OutletContextShape;

  return (
    <div className="container container--y container--full layout__content">
      <NewBreadCrumbs>
        <NewBreadCrumbsLink
          primitiveType="cyberstormLink"
          linkId="Communities"
          csVariant="cyber"
        >
          Communities
        </NewBreadCrumbsLink>
        <NewBreadCrumbsLink
          primitiveType="cyberstormLink"
          linkId="Community"
          community={community.identifier}
          csVariant="cyber"
        >
          {community.name}
        </NewBreadCrumbsLink>
        <NewBreadCrumbsLink
          primitiveType="cyberstormLink"
          linkId="Team"
          community={community.identifier}
          team={listing.namespace}
          csVariant="cyber"
        >
          {listing.namespace}
        </NewBreadCrumbsLink>
        <NewBreadCrumbsLink
          primitiveType="cyberstormLink"
          linkId="Package"
          community={listing.community_identifier}
          namespace={listing.namespace}
          package={listing.name}
          csVariant="cyber"
        >
          {formatToDisplayName(listing.name)}
        </NewBreadCrumbsLink>
        <span>
          <span>Dependants</span>
        </span>
      </NewBreadCrumbs>
      <section className="dependants">
        <PageHeader headingLevel="1" headingSize="3">
          Mods that depend on{" "}
          <NewLink
            primitiveType="cyberstormLink"
            linkId="Package"
            community={listing.community_identifier}
            namespace={listing.namespace}
            package={listing.name}
            csVariant="cyber"
          >
            {formatToDisplayName(listing.name)}
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
        </PageHeader>
        <PackageSearch
          listings={listings}
          packageCategories={filters.package_categories}
          sections={sortedSections}
          config={outletContext.requestConfig}
          currentUser={outletContext.currentUser}
        />
      </section>
    </div>
  );
}
