import styles from "./UserProfileLayout.module.css";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { UserLink } from "../../Links/Links";
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

  return (
    <BaseLayout
      breadCrumb={
        <BreadCrumbs>
          <UserLink user={userId}>{userId}</UserLink>
        </BreadCrumbs>
      }
      header={
        <div className={styles.header}>
          Mods uploaded by <UserLink user={userId}>{userId}</UserLink>
        </div>
      }
      mainContent={
        <PackageSearch
          communityId={"TODO"}
          packageCategories={[]}
          sections={[]}
        />
      }
    />
  );
}

UserProfileLayout.displayName = "UserProfileLayout";
