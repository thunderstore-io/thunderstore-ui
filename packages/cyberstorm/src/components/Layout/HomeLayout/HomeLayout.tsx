import styles from "./HomeLayout.module.css";
import { CommunityCard } from "../../CommunityCard/CommunityCard";
import { PackageCard } from "../../PackageCard/PackageCard";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import { useDapper } from "@thunderstore/dapper";
import {
  Community,
  PaginatedList
} from "@thunderstore/dapper/src/cyberstormSchemas/community";
import usePromise from "react-promise-suspense";

/**
 * Cyberstorm Home Layout
 */
export function HomeLayout() {
  const dapper = useDapper();
  const featuredCommunities: PaginatedList<Community> = usePromise(
    dapper.getCommunities,
    []
  );
  const featuredPackages = usePromise(dapper.getPackageListings, ["featured"]);
  const hotPackages = usePromise(dapper.getPackageListings, ["hot"]);

  return (
    <BaseLayout
      mainContent={
        <div className={styles.content}>
          <div className={styles.specialContent} />
          <div className={styles.cardContent}>
            {featuredCommunities.results?.slice(0, 6).map((communityData) => {
              return (
                <CommunityCard
                  key={communityData.name}
                  communityData={communityData}
                />
              );
            })}
          </div>
          <div className={styles.smallContent} />
          <div className={styles.cardContent}>
            {featuredPackages?.slice(0, 6).map((packageData) => {
              return (
                <PackageCard key={packageData.name} packageData={packageData} />
              );
            })}
          </div>
          <div className={styles.mediumContent} />
          <div className={styles.cardContent}>
            {hotPackages?.slice(0, 6).map((packageData) => {
              return (
                <PackageCard key={packageData.name} packageData={packageData} />
              );
            })}
          </div>
          <div className={styles.mediumContent} />
        </div>
      }
    />
  );
}

HomeLayout.displayName = "HomeLayout";
