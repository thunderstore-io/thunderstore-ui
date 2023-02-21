import React, { ReactNode } from "react";
import styles from "./LeftColumn.module.css";

export interface LeftColumnProps {
  content?: ReactNode;
}

/**
 * Cyberstorm Left Column
 */
export const LeftColumn: React.FC<LeftColumnProps> = (props) => {
  const { content } = props;
  return <div className={styles.root}>{content}</div>;
};

LeftColumn.displayName = "LeftColumn";
LeftColumn.defaultProps = { content: null };
