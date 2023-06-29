"use client";
import { useState } from "react";
import styles from "./TeamSettingsLayout.module.css";
import { BreadCrumbs } from "../../../BreadCrumbs/BreadCrumbs";
import { TeamSettingsLink, TeamsLink } from "../../../Links/Links";
import { Tabs } from "../../../Tabs/Tabs";
import { TeamMembers } from "./TeamMembers/TeamMembers";
import { TeamServiceAccounts } from "./TeamServiceAccounts/TeamServiceAccounts";
import { TeamProfile } from "./TeamProfile/TeamProfile";
import { getTeamSettingsDummyData } from "../../../../dummyData";
import { TeamSettings } from "../../../../schema";
import { BaseLayout } from "../../BaseLayout/BaseLayout";
import { PageHeader } from "../../BaseLayout/PageHeader/PageHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faUsers,
  faUserCog,
  faCog,
} from "@fortawesome/pro-regular-svg-icons";
import { TeamLeaveAndDisband } from "./TeamLeaveAndDisband/TeamLeaveAndDisband";

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
  return getTeamSettingsDummyData(teamId);
}

const tabs = [
  {
    key: 1,
    label: "Profile",
    icon: <FontAwesomeIcon icon={faEdit} fixedWidth />,
  },
  {
    key: 2,
    label: "Members",
    icon: <FontAwesomeIcon icon={faUsers} fixedWidth />,
  },
  {
    key: 3,
    label: "Service Accounts",
    icon: <FontAwesomeIcon icon={faUserCog} fixedWidth />,
  },
  {
    key: 4,
    label: "Settings",
    icon: <FontAwesomeIcon icon={faCog} fixedWidth />,
  },
];

function getTabContent(currentTab: number, teamData: TeamSettings) {
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
        <TeamServiceAccounts
          teamData={teamData}
          serviceAccountData={teamData.serviceAccounts}
        />
      </div>
    );
  } else if (currentTab === 4) {
    tabContent = (
      <div className={styles.tabContent}>
        <TeamLeaveAndDisband teamData={teamData} />
      </div>
    );
  }
  return tabContent;
}
