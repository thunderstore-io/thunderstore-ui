import { useDapper } from "@thunderstore/dapper";
import { Package } from "@thunderstore/dapper/types";
import { usePromise } from "@thunderstore/use-promise";

import styles from "./PackageDependantsLayout.module.css";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import {
  CommunitiesLink,
  CommunityLink,
  PackageLink,
  UserLink,
} from "../../Links/Links";
import { PackageSearch } from "../../PackageSearch/PackageSearch";

interface PackageDependantsLayoutProps {
  package: Package;
}

/**
 * View for listing the packages depending on a given package.
 *
 * TODO: Currently this lists Community's packages as the
 * PackageSearch doesn't support showing dependants.
 */
export function PackageDependantsLayout(props: PackageDependantsLayoutProps) {
  const { package: pkg } = props;

  const dapper = useDapper();
  const community = usePromise(dapper.getCommunity, [pkg.community]);

  return (
    <BaseLayout
      backGroundImageSource={
        community.background_image_url || "/images/community_bg.png"
      }
      breadCrumb={
        <BreadCrumbs>
          <CommunitiesLink>Communities</CommunitiesLink>
          <CommunityLink community={community.identifier}>
            {community.name}
          </CommunityLink>
          <PackageLink
            community={pkg.community}
            namespace={pkg.namespace}
            package={pkg.name}
          >
            {pkg.name}
          </PackageLink>
          Dependants
        </BreadCrumbs>
      }
      header={
        <div className={styles.header}>
          Mods that depend on{" "}
          <PackageLink
            community={pkg.community}
            namespace={pkg.namespace}
            package={pkg.name}
          >
            {pkg.name}
          </PackageLink>
          {pkg.author ? " by " : null}
          {pkg.author ? (
            <UserLink user={pkg.author}>{pkg.author}</UserLink>
          ) : null}
        </div>
      }
      mainContent={
        <PackageSearch
          communityId={pkg.community}
          packageCategories={community.package_categories}
        />
      }
    />
  );
}

PackageDependantsLayout.displayName = "PackageDependantsLayout";
