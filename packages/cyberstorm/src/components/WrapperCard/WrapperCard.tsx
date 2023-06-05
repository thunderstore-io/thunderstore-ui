import styles from "../WrapperCard/WrapperCard.module.css";
import { ReactNode } from "react";

export interface WrapperCardProps {
  title?: string;
  headerIcon?: ReactNode;
  content?: ReactNode;
  headerRightContent?: ReactNode;
}

export function WrapperCard(props: WrapperCardProps) {
  const {
    title = "",
    headerIcon = null,
    content = null,
    headerRightContent = null,
  } = props;
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.icon}>{headerIcon}</div>
        {title}
        <div className={styles.headerRight}>{headerRightContent}</div>
      </div>
      {content}
    </div>
  );
}

WrapperCard.displayName = "WrapperCard";
