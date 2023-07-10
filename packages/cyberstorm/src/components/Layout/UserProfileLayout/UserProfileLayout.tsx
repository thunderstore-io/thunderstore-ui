"use client";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { UserLink } from "../../Links/Links";
import { getUserDummyData } from "../../../dummyData";
import { User } from "../../../schema";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import PackageSearchLayout from "../PackageSearchLayout/PackageSearchLayout";
import styles from "./UserProfileLayout.module.css";

export interface UserProfileLayoutProps {
  userId: string;
}

/**
 * Cyberstorm user's profile Layout
 */
export function UserProfileLayout(props: UserProfileLayoutProps) {
  const { userId } = props;

  const userData: User = getUserData(userId);

  return (
    <BaseLayout
      breadCrumb={
        <BreadCrumbs>
          <UserLink user={userData.name}>{userData.name}</UserLink>
        </BreadCrumbs>
      }
      header={
        <div className={styles.header}>
          {"Mods uploaded by " + userData.name}
        </div>
      }
      mainContent={<PackageSearchLayout userId={userId} />}
    />
  );
}

UserProfileLayout.displayName = "UserProfileLayout";

function getUserData(userId: string) {
  return getUserDummyData(userId);
}
