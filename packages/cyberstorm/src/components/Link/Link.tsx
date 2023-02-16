import React from "react";
import styles from "./Link.module.css";

export interface LinkProps {
  label: string;
}

/**
 * Cyberstorm Link component
 */
export const Link: React.FC<LinkProps> = (props) => {
  const { label } = props;
  return <div className={styles.root}>{label}</div>;
};

Link.displayName = "Link";
Link.defaultProps = {};
