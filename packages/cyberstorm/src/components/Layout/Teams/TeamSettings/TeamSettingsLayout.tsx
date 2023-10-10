"use client";
import { useState } from "react";
import styles from "./TeamSettingsLayout.module.css";
import { BreadCrumbs } from "../../../BreadCrumbs/BreadCrumbs";
import { TeamSettingsLink, TeamsLink } from "../../../Links/Links";
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
import { useDapper } from "@thunderstore/dapper";
import { Team } from "@thunderstore/dapper/types";
import { usePromise } from "@thunderstore/use-promise";
import { Icon } from "../../../Icon/Icon";

interface Props {
  teamName: string;
}

/**
 * View for managing one of the teams of the authenticated user.
 */
export function TeamSettingsLayout(props: Props) {
  const { teamName } = props;

  const dapper = useDapper();
  const teamData = usePromise(dapper.getTeam, [teamName]);

  const [currentTab, setCurrentTab] = useState(1);

  return (
    <BaseLayout
      breadCrumb={
        <BreadCrumbs>
          <TeamsLink>Teams</TeamsLink>
          <TeamSettingsLink team={teamName}>{teamName}</TeamSettingsLink>
        </BreadCrumbs>
      }
      header={<PageHeader title={teamName} />}
      tabs={
        <Tabs tabs={tabs} onTabChange={setCurrentTab} currentTab={currentTab} />
      }
      mainContent={getTabContent(currentTab, teamData)}
    />
  );
}

TeamSettingsLayout.displayName = "TeamSettingsLayout";

const tabs = [
  {
    key: 1,
    label: "Profile",
    icon: (
      <Icon>
        <FontAwesomeIcon icon={faEdit} />
      </Icon>
    ),
  },
  {
    key: 2,
    label: "Members",
    icon: (
      <Icon>
        <FontAwesomeIcon icon={faUsers} />
      </Icon>
    ),
  },
  {
    key: 3,
    label: "Service Accounts",
    icon: (
      <Icon>
        <FontAwesomeIcon icon={faUserCog} />
      </Icon>
    ),
  },
  {
    key: 4,
    label: "Settings",
    icon: (
      <Icon>
        <FontAwesomeIcon icon={faCog} />
      </Icon>
    ),
  },
];

function getTabContent(currentTab: number, teamData: Team) {
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
      <TabClass teamData={teamData} />
    </div>
  );
}
