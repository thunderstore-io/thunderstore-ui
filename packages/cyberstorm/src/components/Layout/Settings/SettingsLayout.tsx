import React, { useState } from "react";
import styles from "./SettingsLayout.module.css";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { CommunityLink, CommunityPackagesLink } from "../../Links/Links";
import { Tabs } from "../../Tabs/Tabs";
import { Title } from "../../Title/Title";
import { Profile } from "./Profile/Profile";
import { Achievements } from "./Achievements/Achievements";
import { Connections } from "./Connections/Connections";
import { UserMods } from "./UserMods/UserMods";
import { UserTeams } from "./UserTeams/UserTeams";
import { Subscriptions } from "./Subscriptions/Subscriptions";
import { Account } from "./Account/Account";

export interface SettingsLayoutProps {
  teamName?: string;
}

/**
 * Cyberstorm Settings Layout
 */
export const SettingsLayout: React.FC<SettingsLayoutProps> = (props) => {
  const { teamName } = props;

  const [currentTab, setCurrentTab] = useState(1);

  return (
    <div className={styles.root}>
      <BreadCrumbs>
        <CommunityLink community={"V-Rising"}>V Rising</CommunityLink>
        <CommunityPackagesLink community={"V-Rising"}>
          Packages
        </CommunityPackagesLink>
      </BreadCrumbs>

      <Title text={teamName} />

      <Tabs tabs={tabs} onTabChange={setCurrentTab} currentTab={currentTab} />

      <div>
        {currentTab === 1 ? (
          <div className={styles.tabContent}>
            <Profile />
          </div>
        ) : null}
        {currentTab === 2 ? (
          <div className={styles.tabContent}>
            <Achievements />
          </div>
        ) : null}
        {currentTab === 3 ? (
          <div className={styles.tabContent}>
            <Connections />
          </div>
        ) : null}
        {currentTab === 4 ? (
          <div className={styles.tabContent}>
            <Subscriptions />
          </div>
        ) : null}
        {currentTab === 5 ? (
          <div className={styles.tabContent}>
            <UserMods />
          </div>
        ) : null}
        {currentTab === 6 ? (
          <div className={styles.tabContent}>
            <UserTeams />
          </div>
        ) : null}
        {currentTab === 6 ? (
          <div className={styles.tabContent}>
            <Account />
          </div>
        ) : null}
      </div>
    </div>
  );
};

SettingsLayout.displayName = "SettingsLayout";
SettingsLayout.defaultProps = { teamName: "" };

const tabs = [
  { key: 1, label: "Profile" },
  { key: 2, label: "Badges & Achievements" },
  { key: 3, label: "Connections" },
  { key: 4, label: "Subscriptions" },
  { key: 5, label: "Mods" },
  { key: 6, label: "Teams" },
  { key: 7, label: "Account" },
];
