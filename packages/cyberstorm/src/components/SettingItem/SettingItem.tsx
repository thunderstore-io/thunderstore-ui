import styles from "../SettingItem/SettingItem.module.css";
import React, { ReactNode } from "react";

export interface SettingItemProps {
  title?: string;
  description?: string;
  content?: ReactNode;
  additionalLeftColumnContent?: ReactNode;
}

export const SettingItem: React.FC<SettingItemProps> = (props) => {
  const { title, description, content, additionalLeftColumnContent } = props;
  return (
    <div className={styles.root}>
      <div className={styles.leftColumn}>
        <div className={styles.leftColumnTitle}>{title}</div>
        <div className={styles.leftColumnDescription}>{description}</div>
        {additionalLeftColumnContent}
      </div>
      <div className={styles.rightColumn}>{content}</div>
    </div>
  );
};

SettingItem.displayName = "SettingItem";
SettingItem.defaultProps = {
  title: "",
  description: "",
  content: null,
  additionalLeftColumnContent: null,
};
