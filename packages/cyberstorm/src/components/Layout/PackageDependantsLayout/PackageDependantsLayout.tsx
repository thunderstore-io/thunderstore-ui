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
  TeamLink,
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
  const community = usePromise(dapper.getCommunity, [pkg.community_identifier]);
  const filters = usePromise(dapper.getCommunityFilters, [
    pkg.community_identifier,
  ]);

  const listingType = {
    kind: "community" as const,
    communityId: pkg.community_identifier,
  };

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
          Packages
          <TeamLink community={pkg.community_identifier} team={pkg.namespace}>
            {pkg.namespace}
          </TeamLink>
          <PackageLink
            community={pkg.community_identifier}
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
            community={pkg.community_identifier}
            namespace={pkg.namespace}
            package={pkg.name}
          >
            {pkg.name}
          </PackageLink>
          {" by "}
          <TeamLink community={pkg.community_identifier} team={pkg.namespace}>
            {pkg.namespace}
          </TeamLink>
        </div>
      }
      mainContent={
        <PackageSearch
          listingType={listingType}
          packageCategories={filters.package_categories}
          sections={filters.sections}
        />
      }
    />
  );
}

PackageDependantsLayout.displayName = "PackageDependantsLayout";
