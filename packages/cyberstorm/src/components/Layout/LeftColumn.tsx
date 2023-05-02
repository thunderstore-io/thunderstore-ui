import { ReactNode } from "react";
import styles from "./LeftColumn.module.css";

export interface LeftColumnProps {
  content?: ReactNode;
}

/**
 * Cyberstorm Left Column
 */
export function LeftColumn(props: LeftColumnProps) {
  const { content } = props;
  return <div className={styles.root}>{content}</div>;
}

LeftColumn.displayName = "LeftColumn";
LeftColumn.defaultProps = { content: null };
