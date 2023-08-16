"use client";
import { useState } from "react";
import styles from "./SettingsLayout.module.css";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { SettingsLink } from "../../Links/Links";
import { Tabs } from "../../Tabs/Tabs";
import { Connections } from "./Connections/Connections";
import { Account } from "./Account/Account";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import { UserSettings } from "@thunderstore/dapper/src/schema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNodes, faCog } from "@fortawesome/pro-regular-svg-icons";
import { PageHeader } from "../BaseLayout/PageHeader/PageHeader";
import { useDapper } from "@thunderstore/dapper";
import usePromise from "react-promise-suspense";

export interface SettingsLayoutProps {
  userId: string;
}

/**
 * Cyberstorm Settings Layout
 */
export function SettingsLayout(props: SettingsLayoutProps) {
  const { userId } = props;

  const dapper = useDapper();
  const userData: UserSettings = usePromise(dapper.getUserSettings, [userId]);

  const [currentTab, setCurrentTab] = useState(1);

  return (
    <BaseLayout
      breadCrumb={
        <BreadCrumbs>
          <SettingsLink>Settings</SettingsLink>
        </BreadCrumbs>
      }
      header={<PageHeader title="Settings" />}
      tabs={
        <Tabs tabs={tabs} onTabChange={setCurrentTab} currentTab={currentTab} />
      }
      mainContent={<>{getTabContent(currentTab, userData)}</>}
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

function getTabContent(currentTab: number, userData: UserSettings) {
  let tabContent = null;
  if (currentTab === 1) {
    tabContent = (
      <div className={styles.tabContent}>
        <Connections userData={userData} />
      </div>
    );
  } else if (currentTab === 2) {
    tabContent = (
      <div className={styles.tabContent}>
        <Account userData={userData} />
      </div>
    );
  }
  return tabContent;
}
