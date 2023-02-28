import React, { useState } from "react";
import styles from "./TeamsLayout.module.css";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { CommunityLink, CommunityPackagesLink } from "../../Links/Links";
import { Tabs } from "../../Tabs/Tabs";
import { TeamLeave } from "./TeamLeaveForm/TeamLeave";
import { TeamDisband } from "./TeamDisbandForm/TeamDisband";
import { Title } from "../../Title/Title";

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
