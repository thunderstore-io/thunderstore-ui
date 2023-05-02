import { useState } from "react";
import styles from "./TeamsLayout.module.css";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { CommunityLink, CommunityPackagesLink } from "../../Links/Links";
import { Tabs } from "../../Tabs/Tabs";
import { TeamLeave } from "./TeamLeave/TeamLeave";
import { TeamDisband } from "./TeamDisband/TeamDisband";
import { Title } from "../../Title/Title";
import { TeamMembers } from "./TeamMembers/TeamMembers";
import { TeamServiceAccounts } from "./TeamServiceAccounts/TeamServiceAccounts";
import { TeamProfile } from "./TeamProfile/TeamProfile";
import { getTeamDummyData } from "../../../dummyData";

export interface TeamsLayoutProps {
  teamId: string;
}

/**
 * Cyberstorm Teams Layout
 */
export function TeamsLayout(props: TeamsLayoutProps) {
  const { teamId } = props;

  const teamData = getTeamData(teamId);

  const [currentTab, setCurrentTab] = useState(1);

  return (
    <div className={styles.root}>
      <BreadCrumbs>
        <CommunityLink community={"V-Rising"}>V Rising</CommunityLink>
        <CommunityPackagesLink community={"V-Rising"}>
          Packages
        </CommunityPackagesLink>
      </BreadCrumbs>

      <Title text={teamData.name} />

      <Tabs tabs={tabs} onTabChange={setCurrentTab} currentTab={currentTab} />

      <div>
        {currentTab === 1 ? (
          <div className={styles.tabContent}>
            <TeamProfile teamData={teamData} />
          </div>
        ) : null}
        {currentTab === 2 ? (
          <div className={styles.tabContent}>
            <TeamMembers
              membersData={teamData.members}
              teamName={teamData.name}
            />
          </div>
        ) : null}
        {currentTab === 3 ? (
          <div className={styles.tabContent}>
            <TeamServiceAccounts
              serviceAccountData={teamData.serviceAccounts}
            />
          </div>
        ) : null}
        {currentTab === 4 ? (
          <div className={styles.tabContent}>Mods content</div>
        ) : null}
        {currentTab === 5 ? (
          <div className={styles.tabContent}>
            <TeamLeave />
            <div className={styles.separator} />
            <TeamDisband teamName={teamData.name} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

TeamsLayout.displayName = "TeamsLayout";
TeamsLayout.defaultProps = {};

function getTeamData(teamId: string) {
  return getTeamDummyData(teamId);
}

const tabs = [
  { key: 1, label: "Profile" },
  { key: 2, label: "Members" },
  { key: 3, label: "Service Accounts" },
  { key: 4, label: "Mods" },
  { key: 5, label: "Settings" },
];
