import styles from "./HomeLayout.module.css";
import { CommunityCard } from "../../CommunityCard/CommunityCard";
import { PackageCard } from "../../PackageCard/PackageCard";
import {
  getCommunityPreviewDummyData,
  getListOfIds,
  getPackagePreviewDummyData,
} from "@thunderstore/dapper/src/implementations/dummy/generate";
import {
  CommunityPreview,
  PackagePreview,
} from "@thunderstore/dapper/src/schema";
import { BaseLayout } from "../BaseLayout/BaseLayout";

/**
 * Cyberstorm Home Layout
 */
export function HomeLayout() {
  const featuredPackages: PackagePreview[] = getFeaturedPackages();
  const hotPackages: PackagePreview[] = getHotPackages();
  const featuredCommunities: CommunityPreview[] = getFeaturedCommunities();

  return (
    <BaseLayout
      mainContent={
        <div className={styles.content}>
          <div className={styles.specialContent} />
          <div className={styles.cardContent}>
            {featuredCommunities.map((communityData) => {
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
            {featuredPackages.map((packageData) => {
              return (
                <PackageCard key={packageData.name} packageData={packageData} />
              );
            })}
          </div>
          <div className={styles.mediumContent} />
          <div className={styles.cardContent}>
            {hotPackages.map((packageData) => {
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

function getFeaturedPackages() {
  return getListOfIds(7).map((packageId) => {
    return getPackagePreviewDummyData(packageId);
  });
}

function getHotPackages() {
  return getFeaturedPackages();
}

function getFeaturedCommunities() {
  return getListOfIds(7).map((communityId) => {
    return getCommunityPreviewDummyData(communityId);
  });
}
