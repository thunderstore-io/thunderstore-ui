"use client";
import { useContext, useEffect, useState } from "react";
import styles from "./PackageListings.module.css";
import { PackageCard } from "../../PackageCard/PackageCard";
import { useDapper } from "@thunderstore/dapper";
import { PackagePreview } from "@thunderstore/dapper/src/schema";
import { FiltersContext } from "../PackageSearchLayout/PackageSearchLayout";

export interface PackageListingsProps {
  communityId?: string;
  userId?: string;
  namespaceId?: string;
  teamId?: string;
}

export interface fetchFromDapperProps extends PackageListingsProps {
  keywords?: string[];
  availableCategories?: {
    [key: string]: {
      label: string;
      value: boolean | undefined;
    };
  };
}

export default function PackageListings(props: PackageListingsProps) {
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
      console.log(datasCall);
      setDatas(datasCall);
    }

    getDatas();
  }, [
    communityId,
    userId,
    namespaceId,
    teamId,
    filters?.keywords,
    filters?.availableCategories,
  ]);

  useEffect(() => {
    const updatedAvailableCategories:
      | {
          [key: string]: {
            label: string;
            value: boolean | undefined;
          };
        }
      | undefined = filters?.availableCategories;
    const packages = datas;
    packages?.map((x) => {
      x.categories.map((category) => {
        if (!filters?.availableCategories[category.slug]) {
          updatedAvailableCategories
            ? (updatedAvailableCategories[category.slug] = {
                label: category.name,
                value: undefined,
              })
            : null;
        }
      });
    });
    if (updatedAvailableCategories) {
      filters?.setAvailableCategories(updatedAvailableCategories);
    }
  }, [datas, filters?.keywords, filters?.availableCategories]);

  return (
    <div className={styles.packageCardList}>
      {datas &&
        datas.map((packageData) => {
          return (
            <PackageCard key={packageData.name} packageData={packageData} />
          );
        })}
    </div>
  );
}
PackageListings.displayName = "PackageListings";
