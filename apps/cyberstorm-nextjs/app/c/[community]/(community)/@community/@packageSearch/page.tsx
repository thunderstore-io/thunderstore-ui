"use client";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";
import { PackageSearch } from "@thunderstore/cyberstorm/src/components/PackageSearch/PackageSearch";

export default function Page({ params }: { params: { community: string } }) {
  const dapper = useDapper();
  const filters = usePromise(dapper.getCommunityFilters, [params.community]);
  const communityId = params.community;

  const listingType = { kind: "community" as const, communityId };

  return (
    <PackageSearch
      listingType={listingType}
      packageCategories={filters.package_categories}
      sections={filters.sections}
    />
  );
}
