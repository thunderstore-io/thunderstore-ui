"use client";
import { useState } from "react";
import styles from "./SettingsLayout.module.css";
import { TitleOnlyBreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { Tabs } from "../../Tabs/Tabs";
import { Connections } from "./Connections/Connections";
import { Account } from "./Account/Account";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNodes, faCog } from "@fortawesome/pro-regular-svg-icons";
import { PageHeader } from "../BaseLayout/PageHeader/PageHeader";
import { useDapper } from "@thunderstore/dapper";
import { UserSettings } from "@thunderstore/dapper/schema";
import usePromise from "react-promise-suspense";

const PAGE_TITLE = "Settings";

export interface SettingsLayoutProps {
  userId: string;
}

/**
 * Cyberstorm Settings Layout
 */
export function SettingsLayout(props: SettingsLayoutProps) {
  const { userId } = props;

  const dapper = useDapper();
  const userSettings = usePromise(dapper.getUserSettings, [userId]);

  const [currentTab, setCurrentTab] = useState(1);

  return (
    <BaseLayout
      breadCrumb={<TitleOnlyBreadCrumbs pageTitle={PAGE_TITLE} />}
      header={<PageHeader title={PAGE_TITLE} />}
      tabs={
        <Tabs tabs={tabs} onTabChange={setCurrentTab} currentTab={currentTab} />
      }
      mainContent={<>{getTabContent(currentTab, userSettings)}</>}
    />
  );
}

SettingsLayout.displayName = "SettingsLayout";

const tabs = [
  {
    key: 1,
    label: "Connections",
    icon: <FontAwesomeIcon icon={faCircleNodes} fixedWidth />,
  },
  {
    key: 2,
    label: "Account",
    icon: <FontAwesomeIcon icon={faCog} fixedWidth />,
  },
];

function getTabContent(currentTab: number, userSettings: UserSettings) {
  let tabContent = null;
  if (currentTab === 1) {
    tabContent = (
      <div className={styles.tabContent}>
        <Connections userData={userSettings} />
      </div>
    );
  } else if (currentTab === 2) {
    tabContent = (
      <div className={styles.tabContent}>
        <Account userData={userSettings} />
      </div>
    );
  }
  return tabContent;
}
