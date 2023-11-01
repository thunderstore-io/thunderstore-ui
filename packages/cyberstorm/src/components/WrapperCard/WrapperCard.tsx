import { Icon } from "../Icon/Icon";
import styles from "../WrapperCard/WrapperCard.module.css";
import { ReactNode } from "react";

export interface WrapperCardProps {
  title?: string;
  headerIcon?: JSX.Element;
  content?: ReactNode;
  headerRightContent?: ReactNode | null;
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
        {headerIcon ? (
          <Icon inline wrapperClasses={styles.icon}>
            {headerIcon}
          </Icon>
        ) : null}
        <div className={styles.title}>{title}</div>
        <div className={styles.headerRight}>{headerRightContent}</div>
      </div>
      {content}
    </div>
  );
}

WrapperCard.displayName = "WrapperCard";
