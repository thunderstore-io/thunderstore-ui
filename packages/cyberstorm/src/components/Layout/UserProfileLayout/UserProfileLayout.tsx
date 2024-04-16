import styles from "./UserProfileLayout.module.css";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { CyberstormLink } from "../../Links/Links";
import { PackageSearch } from "../../PackageSearch/PackageSearch";

interface Props {
  userId: string;
}

/**
 * Cyberstorm user's profile Layout
 *
 * TODO: use Dapper to fetch package categories and sections.
 * TODO: add support for user-scoped package listings to Dapper
 */
export function UserProfileLayout(props: Props) {
  const { userId } = props;
  const listingType = { kind: "community" as const, communityId: "TODO" };

  return (
    <BaseLayout
      breadCrumb={
        <BreadCrumbs>
          <CyberstormLink linkId="User" user={userId}>
            {userId}
          </CyberstormLink>
        </BreadCrumbs>
      }
      header={
        <div className={styles.header}>
          Mods uploaded by{" "}
          <CyberstormLink linkId="User" user={userId}>
            {userId}
          </CyberstormLink>
        </div>
      }
      mainContent={
        <PackageSearch
          listingType={listingType}
          packageCategories={[]}
          sections={[]}
        />
      }
    />
  );
}

UserProfileLayout.displayName = "UserProfileLayout";
