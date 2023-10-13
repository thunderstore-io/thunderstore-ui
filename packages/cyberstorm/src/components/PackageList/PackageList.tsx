"use client";
import { useDapper } from "@thunderstore/dapper";
import { PackagePreview } from "@thunderstore/dapper/types";
import { isEqual } from "lodash";
import { useContext, useEffect, useState } from "react";

import styles from "./PackageList.module.css";
import {
  FiltersContext,
  CategoriesProps,
} from "../Layout/PackageSearchLayout/PackageSearchLayout";
import { PackageCard } from "../PackageCard/PackageCard";

export interface PackageListingsProps {
  communityId?: string;
  userId?: string;
  namespaceId?: string;
  teamId?: string;
}

export interface fetchFromDapperProps extends PackageListingsProps {
  keywords?: string[];
  availableCategories?: CategoriesProps;
}

export default function PackageList(props: PackageListingsProps) {
  const { communityId, userId, namespaceId, teamId } = props;
  const filters = useContext(FiltersContext);
  const dapper = useDapper();
  const [datas, setDatas] = useState<PackagePreview[]>();

  useEffect(() => {
    // React advises to declare the async function directly inside useEffect
    async function getDatas() {
      const datasCall = await dapper.getPackageListings(
        communityId,
        userId,
        undefined,
        teamId,
        filters?.keywords,
        filters?.availableCategories
      );
      setDatas(datasCall);
    }

    getDatas();
  }, [
    communityId,
    dapper.getPackageListings,
    filters?.availableCategories,
    filters?.keywords,
    namespaceId,
    setDatas,
    teamId,
    userId,
  ]);

  useEffect(() => {
    if (filters === null || typeof datas === "undefined") {
      return;
    }

    // filters.availableCategories contains all possible categories for
    // current packages as one might expect from the name, but note that
    // calling filters.setAvailableCategories does NOT filter the
    // categories, but only updates filters.availableCategories[].value
    // booleans which define whether the filter is including/excluding
    // packages (true/false) or off (undefined).
    const updatedAvailableCategories = { ...filters.availableCategories };

    datas.forEach((package_) => {
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
    datas,
    filters?.availableCategories,
    filters?.keywords,
    filters?.setAvailableCategories,
  ]);

  return (
    <div className={styles.packageCardList}>
      {datas?.map((packageData) => (
        <PackageCard key={packageData.name} packageData={packageData} />
      ))}
    </div>
  );
}

PackageList.displayName = "PackageList";
