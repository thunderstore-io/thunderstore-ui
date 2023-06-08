"use client";
import { useState } from "react";
import styles from "./TeamSettingsLayout.module.css";
import { BreadCrumbs } from "../../../BreadCrumbs/BreadCrumbs";
import { TeamSettingsLink, TeamsLink } from "../../../Links/Links";
import { Tabs } from "../../../Tabs/Tabs";
import { TeamLeave } from "./TeamLeave/TeamLeave";
import { TeamDisband } from "./TeamDisband/TeamDisband";
import { Title } from "../../../Title/Title";
import { TeamMembers } from "./TeamMembers/TeamMembers";
import { TeamServiceAccounts } from "./TeamServiceAccounts/TeamServiceAccounts";
import { TeamProfile } from "./TeamProfile/TeamProfile";
import { getTeamDummyData } from "../../../../dummyData";
import { Team } from "../../../../schema";
import { BaseLayout } from "../../BaseLayout/BaseLayout";
import { PageHeader } from "../../BaseLayout/PageHeader/PageHeader";

export interface TeamSettingsLayoutProps {
  teamId: string;
}

/**
 * Cyberstorm Team Settings Layout
 */
export function TeamSettingsLayout(props: TeamSettingsLayoutProps) {
  const { teamId } = props;

  const teamData = getTeamData(teamId);

  const [currentTab, setCurrentTab] = useState(1);

  return (
    <BaseLayout
      breadCrumb={
        <BreadCrumbs>
          <TeamsLink>Teams</TeamsLink>
          <TeamSettingsLink team={teamData.name}>
            {teamData.name}
          </TeamSettingsLink>
        </BreadCrumbs>
      }
      header={<PageHeader title={teamData.name} />}
      tabs={
        <Tabs tabs={tabs} onTabChange={setCurrentTab} currentTab={currentTab} />
      }
      mainContent={<>{getTabContent(currentTab, teamData)}</>}
    />
  );
}

TeamSettingsLayout.displayName = "TeamSettingsLayout";

function getTeamData(teamId: string) {
  return getTeamDummyData(teamId);
}

const tabs = [
  { key: 1, label: "Profile" },
  { key: 2, label: "Members" },
  { key: 3, label: "Service Accounts" },
  { key: 4, label: "Settings" },
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
        <TeamMembers teamData={teamData} />
      </div>
    );
  } else if (currentTab === 3) {
    tabContent = (
      <div className={styles.tabContent}>
        <TeamServiceAccounts serviceAccountData={teamData.serviceAccounts} />
      </div>
    );
  } else if (currentTab === 4) {
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
