"use client";
import {
  BreadCrumbs,
  Tabs,
  TeamSettingsLink,
  TeamsLink,
  PageHeader,
  TeamDetails,
  TeamLeaveAndDisband,
  TeamMembers,
  TeamServiceAccounts,
} from "@thunderstore/cyberstorm";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faUsers,
  faUserCog,
  faCog,
} from "@fortawesome/pro-regular-svg-icons";
import { useState } from "react";
import rootStyles from "../../RootLayout.module.css";
import styles from "./TeamSettingsLayout.module.css";

// TODO: The tabs can be split down to their own NextJS "Slots"
// https://nextjs.org/docs/app/building-your-application/routing/parallel-routes#slots
export default function Page({ params }: { params: { team: string } }) {
  const { team } = params;
  const [currentTab, setCurrentTab] = useState(1);
  return (
    <>
      <BreadCrumbs>
        <TeamsLink>Teams</TeamsLink>
        <TeamSettingsLink team={team}>{team}</TeamSettingsLink>
      </BreadCrumbs>
      <header className={rootStyles.pageHeader}>
        <PageHeader title={team} />
      </header>
      <main className={rootStyles.main}>
        <nav>
          <Tabs
            tabs={tabs}
            onTabChange={setCurrentTab}
            currentTab={currentTab}
          />
        </nav>
        {getTabContent(currentTab, team)}
      </main>
    </>
  );
}

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
