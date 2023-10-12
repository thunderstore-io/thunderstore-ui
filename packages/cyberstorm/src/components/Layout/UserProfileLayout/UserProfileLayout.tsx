import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { UserLink } from "../../Links/Links";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import PackageSearchLayout from "../PackageSearchLayout/PackageSearchLayout";
import styles from "./UserProfileLayout.module.css";

interface Props {
  userId: string;
}

/**
 * Cyberstorm user's profile Layout
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
      mainContent={<PackageSearchLayout userId={userId} />}
    />
  );
}

UserProfileLayout.displayName = "UserProfileLayout";
