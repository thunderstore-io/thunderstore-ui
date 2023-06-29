import styles from "../SettingItem/SettingItem.module.css";
import { ReactNode } from "react";

export interface SettingItemProps {
  title?: string;
  description?: string | ReactNode;
  content?: ReactNode;
  additionalLeftColumnContent?: ReactNode;
}

export function SettingItem(props: SettingItemProps) {
  const {
    title = "",
    description = "",
    content = null,
    additionalLeftColumnContent = null,
  } = props;
  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>
        <div className={styles.leftColumn}>
          <div className={styles.leftColumnRegular}>
            <div className={styles.leftColumnTitle}>{title}</div>
            <div className={styles.leftColumnDescription}>{description}</div>
          </div>
          {additionalLeftColumnContent}
        </div>
        <div className={styles.rightColumn}>{content}</div>
      </div>
    </div>
  );
}

SettingItem.displayName = "SettingItem";
