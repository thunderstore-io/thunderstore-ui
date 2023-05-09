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
import { Team } from "../../../schema";
import { BaseLayout } from "../BaseLayout/BaseLayout";

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
    <BaseLayout
      breadCrumb={
        <BreadCrumbs>
          <CommunityLink community={"V-Rising"}>V Rising</CommunityLink>
          <CommunityPackagesLink community={"V-Rising"}>
            Packages
          </CommunityPackagesLink>
        </BreadCrumbs>
      }
      header={<Title text={teamData.name} />}
      tabs={
        <Tabs tabs={tabs} onTabChange={setCurrentTab} currentTab={currentTab} />
      }
      mainContent={<>{getTabContent(currentTab, teamData)}</>}
    />
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

function getTabContent(currentTab: number, teamData: Team) {
  let tabContent = null;

  if (currentTab === 1) {
    tabContent = (
      <div className={styles.tabContent}>
        <TeamProfile teamData={teamData} />
      </div>
    );
  } else if (currentTab === 2) {
    tabContent = (
      <div className={styles.tabContent}>
        <TeamMembers membersData={teamData.members} teamName={teamData.name} />
      </div>
    );
  } else if (currentTab === 3) {
    tabContent = (
      <div className={styles.tabContent}>
        <TeamServiceAccounts serviceAccountData={teamData.serviceAccounts} />
      </div>
    );
  } else if (currentTab === 4) {
    tabContent = <div className={styles.tabContent}>Mods content</div>;
  } else if (currentTab === 5) {
    tabContent = (
      <div className={styles.tabContent}>
        <TeamLeave />
        <div className={styles.separator} />
        <TeamDisband teamName={teamData.name} />
      </div>
    );
  }
  return tabContent;
}
