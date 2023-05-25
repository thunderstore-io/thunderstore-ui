"use client";
import { useState } from "react";
import styles from "./SettingsLayout.module.css";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { CommunityLink, CommunityPackagesLink } from "../../Links/Links";
import { Tabs } from "../../Tabs/Tabs";
import { Title } from "../../Title/Title";
import { Profile } from "./Profile/Profile";
import { Achievements } from "./Achievements/Achievements";
import { Connections } from "./Connections/Connections";
import { Subscriptions } from "./Subscriptions/Subscriptions";
import { Account } from "./Account/Account";
import { getUserDummyData } from "../../../dummyData";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import { User } from "../../../schema";

export interface SettingsLayoutProps {
  userId: string;
}

/**
 * Cyberstorm Settings Layout
 */
export function SettingsLayout(props: SettingsLayoutProps) {
  const { userId } = props;
  const userData = getUserData(userId);

  const [currentTab, setCurrentTab] = useState(1);

  return (
    <BaseLayout
      breadCrumb={
        <BreadCrumbs>
          <CommunityLink community={"V-Rising"}>V Rising</CommunityLink>
          <CommunityPackagesLink community={"V-Rising"}>
            Packages
          </CommunityPackagesLink>
        </BreadCrumbs>
      }
      header={<Title text="Settings" />}
      tabs={
        <Tabs tabs={tabs} onTabChange={setCurrentTab} currentTab={currentTab} />
      }
      mainContent={<>{getTabContent(currentTab, userData)}</>}
    />
  );
}

function getUserData(userId: string) {
  return getUserDummyData(userId);
}

SettingsLayout.displayName = "SettingsLayout";

const tabs = [
  { key: 1, label: "Profile" },
  { key: 2, label: "Achievements" },
  { key: 3, label: "Connections" },
  { key: 4, label: "Subscriptions" },
  { key: 5, label: "Account" },
];

function getTabContent(currentTab: number, userData: User) {
  let tabContent = null;
  if (currentTab === 1) {
    tabContent = (
      <div className={styles.tabContent}>
        <Profile userData={userData} />
      </div>
    );
  } else if (currentTab === 2) {
    tabContent = (
      <div className={styles.tabContent}>
        <Achievements />
      </div>
    );
  } else if (currentTab === 3) {
    tabContent = (
      <div className={styles.tabContent}>
        <Connections userData={userData} />
      </div>
    );
  } else if (currentTab === 4) {
    tabContent = (
      <div className={styles.tabContent}>
        <Subscriptions />
      </div>
    );
  } else if (currentTab === 5) {
    tabContent = (
      <div className={styles.tabContent}>
        <Account userData={userData} />
      </div>
    );
  }
  return tabContent;
}
