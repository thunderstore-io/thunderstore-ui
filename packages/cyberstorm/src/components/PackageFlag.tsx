import React, { ReactNode } from "react";
import styles from "./componentStyles/PackageFlag.module.css";

export interface PackageFlagProps {
  label?: string;
  icon?: ReactNode;
}

export const PackageFlag: React.FC<PackageFlagProps> = (props) => {
  const { label, icon } = props;
  styles;
  return (
    <div className={"root"}>
      {icon ? <div className="icon__rotate_30">{icon}</div> : null}
      {label ? <div className="label">{label}</div> : null}
    </div>
  );
};
