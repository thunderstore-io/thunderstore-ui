import styles from "./HomeLayout.module.css";
import { CommunityCard } from "../../CommunityCard/CommunityCard";
import { PackageCard } from "../../PackageCard/PackageCard";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";

/**
 * Cyberstorm Home Layout
 */
export function HomeLayout() {
  const dapper = useDapper();
  const featuredCommunities = usePromise(dapper.getCommunities, []);
  // TODO: "featured" or "hot" packages are not supported.
  const featuredPackages = usePromise(dapper.getPackageListings, ["featured"]);
  const hotPackages = usePromise(dapper.getPackageListings, ["hot"]);

  return (
    <BaseLayout
      mainContent={
        <div className={styles.content}>
          <div className={styles.specialContent} />
          <div className={styles.cardContent}>
            {featuredCommunities.results.slice(0, 6).map((community) => (
              <CommunityCard key={community.identifier} community={community} />
            ))}
          </div>
          <div className={styles.smallContent} />
          <div className={styles.cardContent}>
            {featuredPackages.results.slice(0, 6).map((p) => (
              <PackageCard key={p.name} package={p} />
            ))}
          </div>
          <div className={styles.mediumContent} />
          <div className={styles.cardContent}>
            {hotPackages.results.slice(0, 6).map((p) => (
              <PackageCard key={p.name} package={p} />
            ))}
          </div>
          <div className={styles.mediumContent} />
        </div>
      }
    />
  );
}

HomeLayout.displayName = "HomeLayout";
