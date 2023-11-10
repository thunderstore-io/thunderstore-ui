"use client";
import { useDapper } from "@thunderstore/dapper";
import { PackageListingType } from "@thunderstore/dapper/types";
import { usePromise } from "@thunderstore/use-promise";
import { useDeferredValue, useEffect, useState } from "react";

import { PackageCount } from "./PackageCount";
import { PackageOrder, PackageOrderOptions } from "./PackageOrder";
import styles from "./PackageList.module.css";
import { CategorySelection } from "../PackageSearch/types";
import { PackageCard } from "../PackageCard/PackageCard";
import { Pagination } from "../Pagination/Pagination";

interface Props {
  listingType: PackageListingType;
  categories: CategorySelection[];
  deprecated: boolean;
  nsfw: boolean;
  searchQuery: string;
  section: string;
}

const PER_PAGE = 20;

/**
 * Fetches packages based on props and shows them as a list.
 *
 * TODO: add loading indicator over the PackageCard section. Doing so
 *       properly might require rethinking the structure of things, i.e.
 *       adding another wrapping component.
 */
export function PackageList(props: Props) {
  const { categories, deprecated, listingType, nsfw, searchQuery, section } =
    props;

  const [order, setOrder] = useState(PackageOrderOptions.Updated);
  const [page, setPage] = useState(1);

  const deferredCategories = useDeferredValue(categories);
  const deferredDeprecated = useDeferredValue(deprecated);
  const deferredNsfw = useDeferredValue(nsfw);
  const deferredOrder = useDeferredValue(order);
  const deferredPage = useDeferredValue(page);
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const deferredSection = useDeferredValue(section);

  const deferredIncludedCategories = deferredCategories
    .filter((c) => c.selection === "include")
    .map((c) => c.id);

  const deferredExcludedCategories = deferredCategories
    .filter((c) => c.selection === "exclude")
    .map((c) => c.id);

  useEffect(() => {
    setPage(1);
  }, [categories, deprecated, listingType, nsfw, order, searchQuery, section]);

  const dapper = useDapper();
  const packages = usePromise(dapper.getPackageListings, [
    listingType,
    deferredOrder,
    deferredPage,
    deferredSearchQuery,
    deferredIncludedCategories,
    deferredExcludedCategories,
    deferredSection,
    deferredNsfw,
    deferredDeprecated,
  ]);

  return (
    <div className={styles.root}>
      <div className={styles.top}>
        <PackageCount
          page={page}
          pageSize={PER_PAGE}
          searchQuery={searchQuery}
          totalCount={packages.count}
        />

        <PackageOrder order={order} setOrder={setOrder} />
      </div>

      <div className={styles.packages}>
        {packages.results.map((p) => (
          <PackageCard key={`${p.namespace}-${p.name}`} package={p} />
        ))}
      </div>

      <Pagination
        currentPage={page}
        onPageChange={setPage}
        pageSize={PER_PAGE}
        siblingCount={2}
        totalCount={packages.count}
      />
    </div>
  );
}

PackageList.displayName = "PackageList";
