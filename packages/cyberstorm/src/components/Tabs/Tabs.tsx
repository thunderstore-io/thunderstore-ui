import { Dispatch, SetStateAction } from "react";
import styles from "./Tabs.module.css";
import { TabsButton } from "./TabsButton";

interface Tab {
  key: number;
  label: string;
}

export interface TabsProps {
  currentTab: number;
  tabs: Array<Tab>;
  onTabChange: Dispatch<SetStateAction<number>>;
}

/**
 * Cyberstorm Tabs component
 */
export function Tabs(props: TabsProps) {
  const { currentTab, onTabChange, tabs } = props;
  const tabList = tabs?.map((tab) => {
    return (
      <TabsButton
        key={tab.key}
        label={tab.label}
        isSelected={currentTab === tab.key}
        onClick={() => onTabChange(tab.key)}
      />
    );
  });
  return <div className={styles.root}>{tabList}</div>;
}

Tabs.displayName = "Tabs";
