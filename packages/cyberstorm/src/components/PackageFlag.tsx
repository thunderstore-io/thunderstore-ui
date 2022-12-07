import React, { ReactNode } from "react";
import styles from "./componentStyles/PackageFlag.module.css";

export interface PackageFlagProps {
  label?: string;
  icon?: ReactNode;
}

export const PackageFlag: React.FC<PackageFlagProps> = (props) => {
  const { label, icon } = props;
  return (
    <div className={styles.root}>
      {icon ? <div className={styles.icon}>{icon}</div> : null}
      {label ? <div className={styles.label}>{label}</div> : null}
    </div>
  );
};
