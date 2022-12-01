import React, { ReactNode } from "react";
import styles from "./componentStyles/PackageFlag.module.css";

export interface PackageFlagProps {
  label?: string;
  icon?: ReactNode;
  packageFlagStyle?: string;
}

/**
 * Cyberstorm PackageFlag component
 */
export const PackageFlag: React.FC<PackageFlagProps> = (props) => {
  const { label, icon } = props;
  styles;
  return (
    <button type="button" className={"packageFlag"}>
      {icon ? <div className="icon__rotate_30">{icon}</div> : null}
      {label ? <div className="packageFlagLabel">{label}</div> : null}
    </button>
  );
};
