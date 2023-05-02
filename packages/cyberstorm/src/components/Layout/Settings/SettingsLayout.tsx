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
    <div className={styles.root}>
      <BreadCrumbs>
        <CommunityLink community={"V-Rising"}>V Rising</CommunityLink>
        <CommunityPackagesLink community={"V-Rising"}>
          Packages
        </CommunityPackagesLink>
      </BreadCrumbs>

      <Title text="Settings" />

      <Tabs tabs={tabs} onTabChange={setCurrentTab} currentTab={currentTab} />

      <div>
        {currentTab === 1 ? (
          <div className={styles.tabContent}>
            <Profile userData={userData} />
          </div>
        ) : null}
        {currentTab === 2 ? (
          <div className={styles.tabContent}>
            <Achievements />
          </div>
        ) : null}
        {currentTab === 3 ? (
          <div className={styles.tabContent}>
            <Connections userData={userData} />
          </div>
        ) : null}
        {currentTab === 4 ? (
          <div className={styles.tabContent}>
            <Subscriptions />
          </div>
        ) : null}
        {currentTab === 5 ? (
          <div className={styles.tabContent}>
            <Account userData={userData} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function getUserData(userId: string) {
  return getUserDummyData(userId);
}

SettingsLayout.displayName = "SettingsLayout";
SettingsLayout.defaultProps = {};

const tabs = [
  { key: 1, label: "Profile" },
  { key: 2, label: "Achievements" },
  { key: 3, label: "Connections" },
  { key: 4, label: "Subscriptions" },
  { key: 5, label: "Account" },
];
