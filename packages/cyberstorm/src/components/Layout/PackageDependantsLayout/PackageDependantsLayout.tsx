import { useDapper } from "@thunderstore/dapper";
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

interface Props {
  communityId: string;
  namespaceId: string;
  packageName: string;
}

/**
 * View for listing the packages depending on a given package.
 */
export function PackageDependantsLayout(props: Props) {
  const { communityId, namespaceId, packageName } = props;

  const dapper = useDapper();
  const community = usePromise(dapper.getCommunity, [communityId]);
  const filters = usePromise(dapper.getCommunityFilters, [communityId]);

  const listingType = {
    kind: "package-dependants" as const,
    communityId,
    namespaceId,
    packageName,
  };

  return (
    <BaseLayout
      backGroundImageSource={community.background_image_url}
      breadCrumb={
        <BreadCrumbs>
          <CommunitiesLink>Communities</CommunitiesLink>
          <CommunityLink community={communityId}>
            {community.name}
          </CommunityLink>
          Packages
          <TeamLink community={communityId} team={namespaceId}>
            {namespaceId}
          </TeamLink>
          <PackageLink
            community={communityId}
            namespace={namespaceId}
            package={packageName}
          >
            {packageName}
          </PackageLink>
          Dependants
        </BreadCrumbs>
      }
      header={
        <div className={styles.header}>
          Mods that depend on{" "}
          <PackageLink
            community={communityId}
            namespace={namespaceId}
            package={packageName}
          >
            {packageName}
          </PackageLink>
          {" by "}
          <TeamLink community={communityId} team={namespaceId}>
            {namespaceId}
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
