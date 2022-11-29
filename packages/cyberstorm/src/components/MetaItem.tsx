import React, { ReactNode } from "react";
import styles from "./componentStyles/MetaItem.module.css";

export interface MetaItemProps {
  label?: string;
  icon?: ReactNode;
  metaItemStyle: "default" | "tertiary";
}

/**
 * Cyberstorm MetaItem component
 * Used for displaying a single data point (e.g. an amount
 * of likes or a size of a package) with an icon next to it
 */
export const MetaItem: React.FC<MetaItemProps> = (props) => {
  const { label, icon, metaItemStyle } = props;

  return (
    <div
      /* TS is not aware of defaultProps of function components. */
      /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
      className={`${styles.root} ${getStyle(metaItemStyle)}`}
    >
      {icon}
      {label ? <div className={styles.label}>{label}</div> : null}
    </div>
  );
};

MetaItem.defaultProps = { metaItemStyle: "default" };

function getStyle(style: string) {
  switch (style) {
    case "tertiary":
      return styles.metaItem__tertiary;
    case "default":
    default:
      return styles.metaItem__default;
  }
}
