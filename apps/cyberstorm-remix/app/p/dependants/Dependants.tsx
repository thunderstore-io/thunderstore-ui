import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { BreadCrumbs, CyberstormLink } from "@thunderstore/cyberstorm";
import styles from "./Dependants.module.css";
import rootStyles from "../../RootLayout.module.css";
import { getDapper } from "cyberstorm/dapper/sessionUtils";
import { PackageSearch } from "~/commonComponents/PackageSearch/PackageSearch";
import { ApiError } from "@thunderstore/thunderstore-api";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.community.name },
    { name: "description", content: `Mods for ${data?.community.name}` },
  ];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    try {
      const dapper = await getDapper();
      const searchParams = new URL(request.url).searchParams;
      const order = searchParams.get("order");
      const page = searchParams.get("page");
      const search = searchParams.get("search");
      const includedCategories = searchParams.get("includedCategories");
      const excludedCategories = searchParams.get("excludedCategories");
      const section = searchParams.get("section");
      const nsfw = searchParams.get("nsfw");
      const deprecated = searchParams.get("deprecated");
      const created_recent = searchParams.get("created_recent");
      const updated_recent = searchParams.get("updated_recent");
      const created_after = searchParams.get("created_after");
      const created_before = searchParams.get("created_before");
      const updated_after = searchParams.get("updated_after");
      const updated_before = searchParams.get("updated_before");
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
          deprecated === "true" ? true : false,
          created_recent ?? "",
          updated_recent ?? "",
          created_after ?? "",
          created_before ?? "",
          updated_after ?? "",
          updated_before ?? ""
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
      const dapper = await getDapper(true);
      const searchParams = new URL(request.url).searchParams;
      const order = searchParams.get("order");
      const page = searchParams.get("page");
      const search = searchParams.get("search");
      const includedCategories = searchParams.get("includedCategories");
      const excludedCategories = searchParams.get("excludedCategories");
      const section = searchParams.get("section");
      const nsfw = searchParams.get("nsfw");
      const deprecated = searchParams.get("deprecated");
      const created_recent = searchParams.get("created_recent");
      const updated_recent = searchParams.get("updated_recent");
      const created_after = searchParams.get("created_after");
      const created_before = searchParams.get("created_before");
      const updated_after = searchParams.get("updated_after");
      const updated_before = searchParams.get("updated_before");
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
          deprecated === "true" ? true : false,
          created_recent ?? "",
          updated_recent ?? "",
          created_after ?? "",
          created_before ?? "",
          updated_after ?? "",
          updated_before ?? ""
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

export default function Community() {
  const { community, filters, listing, listings } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  return (
    <>
      {community.background_image_url ? (
        <div
          className={styles.backgroundImg}
          style={{
            backgroundImage: `url(${community.background_image_url})`,
          }}
        />
      ) : null}
      <BreadCrumbs>
        <CyberstormLink linkId="Communities">Communities</CyberstormLink>
        <CyberstormLink linkId="Community" community={community.identifier}>
          {community.name}
        </CyberstormLink>
        <CyberstormLink linkId="Team" team={listing.namespace}>
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
      </BreadCrumbs>
      <header className={rootStyles.pageHeader}>
        <div className={styles.root}>
          <div className={styles.header}>
            Mods that depend on{" "}
            <CyberstormLink
              linkId="Package"
              community={listing.community_identifier}
              namespace={listing.namespace}
              package={listing.name}
            >
              {listing.name}
            </CyberstormLink>
            {" by "}
            <CyberstormLink
              linkId="Team"
              community={listing.community_identifier}
              team={listing.namespace}
            >
              {listing.namespace}
            </CyberstormLink>
          </div>
        </div>
      </header>
      <main className={rootStyles.main}>
        <PackageSearch
          listings={listings}
          packageCategories={filters.package_categories}
          sections={filters.sections}
        />
      </main>
    </>
  );
}
