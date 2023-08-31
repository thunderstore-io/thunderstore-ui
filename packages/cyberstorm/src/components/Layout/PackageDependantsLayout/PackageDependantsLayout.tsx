import { PackageDependantsBreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { PackageLink, UserLink } from "../../Links/Links";
import { Package } from "@thunderstore/dapper/src/schema";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import PackageSearchLayout from "../PackageSearchLayout/PackageSearchLayout";
import styles from "./PackageDependantsLayout.module.css";
import { useDapper } from "@thunderstore/dapper";
import usePromise from "react-promise-suspense";

export interface PackageDependantsLayoutProps {
  isLoading?: boolean;
  packageData: Package;
}

/**
 * Cyberstorm PackageList Layout
 */
export function PackageDependantsLayout(props: PackageDependantsLayoutProps) {
  const { packageData } = props;

  const dapper = useDapper();
  const communityData = usePromise(dapper.getCommunity, [
    packageData.community,
  ]);

  return (
    <BaseLayout
      backGroundImageSource={
        communityData.community.background_image_url ||
        "/images/community_bg.png"
      }
      breadCrumb={
        <PackageDependantsBreadCrumbs
          community={communityData.community.name}
          packageName={packageData.name}
          packageNameSpace={packageData.namespace}
        />
      }
      header={
        <div className={styles.header}>
          Mods that depend on{" "}
          <PackageLink
            community={packageData.community}
            namespace={packageData.namespace}
            package={packageData.name}
          >
            {packageData.name}
          </PackageLink>
          {packageData.author ? " by " : null}
          {packageData.author ? (
            <UserLink user={packageData.author}>{packageData.author}</UserLink>
          ) : null}
        </div>
      }
      mainContent={
        <PackageSearchLayout communityId={communityData.community.name} />
      }
    />
  );
}

PackageDependantsLayout.displayName = "PackageDependantsLayout";
