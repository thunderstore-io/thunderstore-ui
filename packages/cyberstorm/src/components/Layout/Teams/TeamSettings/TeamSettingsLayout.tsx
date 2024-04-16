"use client";
import { useState } from "react";
import styles from "./TeamSettingsLayout.module.css";
import { BreadCrumbs } from "../../../BreadCrumbs/BreadCrumbs";
import { CyberstormLink } from "../../../Links/Links";
import { Tabs } from "../../../Tabs/Tabs";
import { TeamMembers } from "./TeamMembers/TeamMembers";
import { TeamServiceAccounts } from "./TeamServiceAccounts/TeamServiceAccounts";
import { TeamDetails } from "./TeamDetails/TeamDetails";
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

interface Props {
  teamName: string;
}

/**
 * View for managing one of the teams of the authenticated user.
 */
export function TeamSettingsLayout(props: Props) {
  const { teamName } = props;

  const [currentTab, setCurrentTab] = useState(1);

  return (
    <BaseLayout
      breadCrumb={
        <BreadCrumbs>
          <CyberstormLink linkId="Teams">Teams</CyberstormLink>
          <CyberstormLink linkId="TeamSettings" team={teamName}>
            {teamName}
          </CyberstormLink>
        </BreadCrumbs>
      }
      header={<PageHeader title={teamName} />}
      tabs={
        <Tabs tabs={tabs} onTabChange={setCurrentTab} currentTab={currentTab} />
      }
      mainContent={getTabContent(currentTab, teamName)}
    />
  );
}

TeamSettingsLayout.displayName = "TeamSettingsLayout";

const tabs = [
  {
    key: 1,
    label: "Profile",
    icon: <FontAwesomeIcon icon={faEdit} />,
  },
  {
    key: 2,
    label: "Members",
    icon: <FontAwesomeIcon icon={faUsers} />,
  },
  {
    key: 3,
    label: "Service Accounts",
    icon: <FontAwesomeIcon icon={faUserCog} />,
  },
  {
    key: 4,
    label: "Settings",
    icon: <FontAwesomeIcon icon={faCog} />,
  },
];

function getTabContent(currentTab: number, teamName: string) {
  const TabClass = {
    1: TeamDetails,
    2: TeamMembers,
    3: TeamServiceAccounts,
    4: TeamLeaveAndDisband,
  }[currentTab];

  if (TabClass === undefined) {
    throw new Error(`Unknown tab number ${currentTab}`);
  }

  return (
    <div className={styles.tabContent}>
      <TabClass teamName={teamName} />
    </div>
  );
}
