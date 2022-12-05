import React, { ReactNode } from "react";
import styles from "./componentStyles/MetaItem.module.css";

export interface MetaItemProps {
  label?: string;
  icon?: ReactNode;
  colorScheme?: "default" | "tertiary";
}

/**
 * Cyberstorm MetaItem component
 * Used for displaying a single data point (e.g. an amount
 * of likes or a size of a package) with an icon next to it
 */
export const MetaItem: React.FC<MetaItemProps> = (props) => {
  const { label, icon, colorScheme } = props;

  return (
    <div className={`${styles.root} ${getStyle(colorScheme)}`}>
      {icon}
      {label ? <div className={styles.label}>{label}</div> : null}
    </div>
  );
};

MetaItem.defaultProps = {};

const getStyle = (scheme: MetaItemProps["colorScheme"] = "default") => {
  return {
    tertiary: styles.metaItem__tertiary,
    default: styles.metaItem__default,
  }[scheme];
};
