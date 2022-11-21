import React, { ReactNode } from "react";
import styles from "./componentStyles/MetaItem.module.css";

export interface MetaItemProps {
  label?: string;
  icon?: ReactNode;
  metaItemStyle?: "metaItem__default" | "metaItem__green";
}

/**
 * Cyberstorm MetaItem component
 */
export const MetaItem: React.FC<MetaItemProps> = (props) => {
  const { label, icon, metaItemStyle } = props;

  return (
    <div
      /* TS is not aware of defaultProps of function components. */
      /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
      className={`${styles.metaItem} ${styles[metaItemStyle!]}`}
    >
      {icon}
      {label ? <div className={styles.metaItemLabel}>{label}</div> : null}
    </div>
  );
};
