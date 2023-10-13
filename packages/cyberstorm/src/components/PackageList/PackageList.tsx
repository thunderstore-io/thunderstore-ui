"use client";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";
import { isEqual } from "lodash";
import { useContext, useEffect } from "react";

import styles from "./PackageList.module.css";
import { FiltersContext } from "../PackageSearch/PackageSearch";
import { PackageCard } from "../PackageCard/PackageCard";

interface Props {
  communityId?: string;
  userId?: string;
  namespaceId?: string;
  teamId?: string;
}

export function PackageList(props: Props) {
  const { communityId, userId, namespaceId, teamId } = props;
  const filters = useContext(FiltersContext);
  const dapper = useDapper();

  const packages = usePromise(dapper.getPackageListings, [
    communityId,
    userId,
    namespaceId,
    teamId,
    filters?.keywords,
    filters?.availableCategories,
  ]);

  useEffect(() => {
    if (filters === null) {
      return;
    }

    // filters.availableCategories contains all possible categories for
    // current packages as one might expect from the name, but note that
    // calling filters.setAvailableCategories does NOT filter the
    // categories, but only updates filters.availableCategories[].value
    // booleans which define whether the filter is including/excluding
    // packages (true/false) or off (undefined).
    const updatedAvailableCategories = { ...filters.availableCategories };

    packages.forEach((package_) => {
      package_.categories.forEach((category) => {
        updatedAvailableCategories[category.slug] = {
          label: category.name,
          value: filters.availableCategories[category.slug]?.value,
        };
      });
    });

    if (!isEqual(updatedAvailableCategories, filters.availableCategories)) {
      filters.setAvailableCategories(updatedAvailableCategories);
    }
  }, [
    filters?.availableCategories,
    filters?.keywords,
    filters?.setAvailableCategories,
    packages,
  ]);

  return (
    <div className={styles.root}>
      {packages.map((packageData) => (
        <PackageCard key={packageData.name} packageData={packageData} />
      ))}
    </div>
  );
}

PackageList.displayName = "PackageList";
