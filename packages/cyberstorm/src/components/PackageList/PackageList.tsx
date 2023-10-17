"use client";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";
import { useState } from "react";

import { PackageCount } from "./PackageCount";
import { PackageOrder, PackageOrderOptions } from "./PackageOrder";
import styles from "./PackageList.module.css";
import { CategorySelection } from "../PackageSearch/types";
import { PackageCard } from "../PackageCard/PackageCard";

interface Props {
  communityId?: string;
  userId?: string;
  namespaceId?: string;
  teamId?: string;
  searchQuery: string;
  categories: CategorySelection[];
}

/**
 * Fetches packages based on props and shows them as a list.
 *
 * TODO: use categories props by splitting them to included and excluded
 *       categories and pass them to getPackageListings (which doesn't)
 *       currently support this format.
 *
 * TODO: we also support only one searchQuery, so the Dapper method
 *       shouldn't expect an array of them.
 *
 * TODO: Add support for order in Dapper method.
 */
export function PackageList(props: Props) {
  const { communityId, namespaceId, searchQuery, teamId, userId } = props;

  const [order, setOrder] = useState(PackageOrderOptions.Updated);
  const dapper = useDapper();

  const packages = usePromise(dapper.getPackageListings, [
    communityId,
    userId,
    namespaceId,
    teamId,
    [searchQuery],
  ]);

  return (
    <div className={styles.root}>
      <div className={styles.top}>
        <PackageCount
          page={1}
          pageSize={20}
          searchQuery={searchQuery}
          totalCount={327}
        />

        <PackageOrder order={order} setOrder={setOrder} />
      </div>
      <div className={styles.packages}>
        {packages.map((packageData) => (
          <PackageCard key={packageData.name} packageData={packageData} />
        ))}
      </div>
    </div>
  );
}

PackageList.displayName = "PackageList";
