import React from "react";
import styles from "./BreadCrumb.module.css";

export interface BreadCrumbProps {}

/**
 * Cyberstorm Title component
 */
export const BreadCrumb: React.FC<BreadCrumbProps> = () => {
  return <div className={styles.root}>Communities / V Rising / Mods</div>;
};

BreadCrumb.displayName = "BreadCrumb";
BreadCrumb.defaultProps = { colorScheme: "default", size: "medium" };
