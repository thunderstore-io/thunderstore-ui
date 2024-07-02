"use client";
import { useState } from "react";
import styles from "./SettingsLayout.module.css";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { CyberstormLink } from "../../Links/Links";
import { Tabs } from "../../Tabs/Tabs";
import { Connections } from "./Connections/Connections";
import { Account } from "./Account/Account";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNodes, faCog } from "@fortawesome/free-solid-svg-icons";
import { PageHeader } from "../BaseLayout/PageHeader/PageHeader";
import { useDapper } from "@thunderstore/dapper";
import { CurrentUser } from "@thunderstore/dapper/types";
import { usePromise } from "@thunderstore/use-promise";

/**
 * View containing settings for the authenticated user's account.
 */
export function SettingsLayout() {
  const dapper = useDapper();
  const user = usePromise(dapper.getCurrentUser, []);

  const [currentTab, setCurrentTab] = useState(1);

  return (
    <BaseLayout
      breadCrumb={
        <BreadCrumbs>
          <CyberstormLink linkId="Settings">Settings</CyberstormLink>
        </BreadCrumbs>
      }
      header={<PageHeader title="Settings" />}
      tabs={
        <Tabs tabs={tabs} onTabChange={setCurrentTab} currentTab={currentTab} />
      }
      mainContent={getTabContent(currentTab, user)}
    />
  );
}

SettingsLayout.displayName = "SettingsLayout";

const tabs = [
  {
    key: 1,
    label: "Connections",
    icon: <FontAwesomeIcon icon={faCircleNodes} />,
  },
  {
    key: 2,
    label: "Account",
    icon: <FontAwesomeIcon icon={faCog} />,
  },
];

function getTabContent(currentTab: number, user: CurrentUser) {
  if (currentTab === 1) {
    return (
      <div className={styles.tabContent}>
        <Connections connections={user.connections} />
      </div>
    );
  } else if (currentTab === 2) {
    return (
      <div className={styles.tabContent}>
        <Account username={user.username} />
      </div>
    );
  }

  throw new Error(`Unknown tab key "${currentTab}"`);
}
