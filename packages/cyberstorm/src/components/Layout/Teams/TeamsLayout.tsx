import React, { useState } from "react";
import styles from "./TeamsLayout.module.css";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { CommunityLink, CommunityPackagesLink } from "../../Links/Links";
import { Tabs } from "../../Tabs/Tabs";
import { TeamLeave } from "./TeamLeave/TeamLeave";
import { TeamDisband } from "./TeamDisband/TeamDisband";
import { Title } from "../../Title/Title";
import { TeamMembers } from "./TeamMembers/TeamMembers";
import { UserDataItem } from "./TeamMembers/UserList/UserList";
import { TeamServiceAccounts } from "./TeamServiceAccounts/TeamServiceAccounts";
import { ServiceAccountDataItem } from "./TeamServiceAccounts/ServiceAccountList/ServiceAccountList";
import { TeamProfile } from "./TeamProfile/TeamProfile";

export interface TeamsLayoutProps {
  teamName?: string;
}

/**
 * Cyberstorm Teams Layout
 */
export const TeamsLayout: React.FC<TeamsLayoutProps> = (props) => {
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
            <TeamProfile />
          </div>
        ) : null}
        {currentTab === 2 ? (
          <div className={styles.tabContent}>
            <TeamMembers userData={userData} />
          </div>
        ) : null}
        {currentTab === 3 ? (
          <div className={styles.tabContent}>
            <TeamServiceAccounts serviceAccountData={serviceAccountData} />
          </div>
        ) : null}
        {currentTab === 4 ? (
          <div className={styles.tabContent}>Mods content</div>
        ) : null}
        {currentTab === 5 ? (
          <div className={styles.tabContent}>
            <TeamLeave />
            <div className={styles.separator} />
            <TeamDisband teamName={teamName} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

TeamsLayout.displayName = "TeamsLayout";
TeamsLayout.defaultProps = { teamName: "" };

const tabs = [
  { key: 1, label: "Profile" },
  { key: 2, label: "Members" },
  { key: 3, label: "Service Accounts" },
  { key: 4, label: "Mods" },
  { key: 5, label: "Settings" },
];

const userData: Array<UserDataItem> = [
  { userName: "Chad", role: "2", userImageSrc: "/images/chad.jpg" },
  { userName: "Doggo", role: "1", userImageSrc: "/images/dog.jpg" },
  { userName: "Thomas", role: "1", userImageSrc: "/images/thomas.jpg" },
];

const serviceAccountData: Array<ServiceAccountDataItem> = [
  { serviceAccountName: "ChadSA", lastUsed: "2011-11-09 16:41" },
];
