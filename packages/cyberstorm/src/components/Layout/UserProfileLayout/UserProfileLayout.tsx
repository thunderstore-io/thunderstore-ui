import { TitleOnlyBreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { UserLink } from "../../Links/Links";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import PackageSearchLayout from "../PackageSearchLayout/PackageSearchLayout";
import styles from "./UserProfileLayout.module.css";
import { useDapper } from "@thunderstore/dapper/";
import { UserData } from "@thunderstore/dapper/src/cyberstormMethods/user";
import usePromise from "react-promise-suspense";

export interface UserProfileLayoutProps {
  userId: string;
}

/**
 * Cyberstorm user's profile Layout
 */
export function UserProfileLayout(props: UserProfileLayoutProps) {
  const { userId } = props;

  const dapper = useDapper();
  const userData: UserData = usePromise(dapper.getUser, [userId]);

  return (
    <BaseLayout
      breadCrumb={<TitleOnlyBreadCrumbs pageTitle={userData.user.name} />}
      header={
        <div className={styles.header}>
          {userData?.user?.name ? (
            <>
              Mods uploaded by{" "}
              <UserLink user={userData.user.name}>
                {userData.user.name}
              </UserLink>
            </>
          ) : (
            <></>
          )}
        </div>
      }
      mainContent={<PackageSearchLayout userId={userId} />}
    />
  );
}

UserProfileLayout.displayName = "UserProfileLayout";
