"use client";
import { useState } from "react";
import styles from "./SettingsLayout.module.css";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { SettingsLink } from "../../Links/Links";
import { Tabs } from "../../Tabs/Tabs";
import { Profile } from "./Profile/Profile";
import { Achievements } from "./Achievements/Achievements";
import { Connections } from "./Connections/Connections";
import { Subscriptions } from "./Subscriptions/Subscriptions";
import { Account } from "./Account/Account";
import { getUserSettingsDummyData } from "../../../dummyData";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import { UserSettings } from "../../../schema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faTrophy,
  faCircleNodes,
  faCog,
} from "@fortawesome/pro-regular-svg-icons";
import { PageHeader } from "../BaseLayout/PageHeader/PageHeader";

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
          <SettingsLink>Settings</SettingsLink>
        </BreadCrumbs>
      }
      header={<PageHeader title="Settings" />}
      tabs={
        <Tabs tabs={tabs} onTabChange={setCurrentTab} currentTab={currentTab} />
      }
      mainContent={<>{getTabContent(currentTab, userData)}</>}
    />
  );
}

function getUserData(userId: string) {
  return getUserSettingsDummyData(userId);
}

SettingsLayout.displayName = "SettingsLayout";

const tabs = [
  {
    key: 1,
    label: "Profile",
    icon: <FontAwesomeIcon icon={faUser} fixedWidth />,
  },
  {
    key: 2,
    label: "Achievements",
    icon: <FontAwesomeIcon icon={faTrophy} fixedWidth />,
  },
  {
    key: 3,
    label: "Connections",
    icon: <FontAwesomeIcon icon={faCircleNodes} fixedWidth />,
  },
  {
    key: 4,
    label: "Account",
    icon: <FontAwesomeIcon icon={faCog} fixedWidth />,
  },
];

function getTabContent(currentTab: number, userData: UserSettings) {
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
