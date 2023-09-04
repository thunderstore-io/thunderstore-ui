import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import {
  CommunitiesLink,
  CommunityLink,
  PackageLink,
  UserLink,
} from "../../Links/Links";
import { Package } from "@thunderstore/dapper/types";
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
        <BreadCrumbs>
          <CommunitiesLink>Communities</CommunitiesLink>
          <CommunityLink community={communityData.community.name}>
            {communityData.community.name}
          </CommunityLink>
          <PackageLink
            community={packageData.community}
            namespace={packageData.namespace}
            package={packageData.name}
          >
            {packageData.name}
          </PackageLink>
          Dependants
        </BreadCrumbs>
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
